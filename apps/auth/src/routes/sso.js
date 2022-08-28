import express from "express";
import log from "loglevel";
import dotenv from "dotenv";
import saml from "samlify";
import validator from "@authenio/samlify-node-xmllint";
import xml2js from "xml2js";

import { Account } from "models";
import { generateToken } from "../utils/token.js";

log.setLevel("debug");

dotenv.config();

const builder = new xml2js.Builder();

saml.setSchemaValidator(validator);

const sp = saml.ServiceProvider({
  entityID: `${process.env.AUTH_URI}/login/sso/metadata`,
  assertionConsumerService: [
    {
      Binding: saml.Constants.namespace.binding.post,
      Location: `${process.env.AUTH_URI}/login/sso/callback`,
    },
  ],
});

const router = express.Router();

router.route("/").post(async (req, res) => {
  // User posts email address to this endpoint
  // We verify the email address provider is a valid email address format
  // We get the domain from the email address
  // We then look up the account in the database via the ssoDomain field
  // If the account is found, we check the sso type
  // If the sso type is saml, we send them off to thir saml provider
  // If the sso type is local, we throw an error, because local auth shouldn't have an ssoDomain
  // After we get a valid response back from the sso provider, we generate a token and send it back to the user
  // The user can then use the token to log in

  try {
    const { email } = req.body;

    // verify the email is a valid email address
    if (!email || !email.includes("@")) {
      return res.status(400).send("Invalid email address");
    }

    // get the domain from the email
    const emailDomain = email.split("@")[1];

    log.debug(emailDomain);

    // Find the account in the database that matches our email domain.
    const account = await Account.findOne({ ssoDomain: emailDomain });
    log.debug("account.name:", account.name);

    if (!account) {
      // return invalid message
      return res.status(401).json({
        message:
          "Unable to find an account matching this domain. Contact your administrator to set up SSO.",
      });
    }

    // check the auth type of the account.
    if (account.auth === "saml") {
      // send the user to their saml provider
      // log.debug(`samlConfig: ${account.samlConfig}`);

      // const metadataXml = convertToXml(account.samlConfig.metadataXml);
      // const samlConfig = JSON.stringify(account.samlConfig);
      const samlConfig = account.samlConfig;
      // log.debug(samlConfig);
      const metadataXml = builder.buildObject(samlConfig);
      // log.debug("metadataXml:", metadataXml);

      const idp = saml.IdentityProvider({
        metadata: metadataXml,
      });

      // log.debug("idp", idp);
      // log.debug("sp:", sp);

      const { id, context } = sp.createLoginRequest(idp, "redirect");
      // log.debug(id);
      // log.debug(context);
      return res.status(200).json({
        message: `${context}`,
      });
    } else if (account.auth === "oauth2") {
      // send the user to their oauth2 provider
      return res.redirect(`/oauth2/${account.name}`);
    } else if (account.auth === "ldap") {
      // send the user to their ldap provider
      return res.redirect(`/ldap/${account.name}`);
    } else {
      log.error(`Unknown auth type: ${account.auth}`);
      // something unexpected happened
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  } catch (err) {
    log.error("error:", err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.route("/callback").post(async (req, res) => {
  log.debug("/callback");

  // if account is not in the query string, return malformed request
  if (!req.query.account) {
    return res.status(400).send("Malformed request");
  }

  try {
    // get the account from the query string parameter
    const accountName = req.query.account;
    // log.debug("accountName:", accountName);

    const account = await Account.findOne({ name: accountName });
    // log.debug("account:", account);

    const samlConfig = account.samlConfig;
    // log.debug("samlConfig:", samlConfig);

    const metadataXml = builder.buildObject(samlConfig);
    // log.debug("metadataXml:", metadataXml);

    const idp = saml.IdentityProvider({
      metadata: metadataXml,
    });
    // log.debug("idp:", idp);

    // This parseLoginResponse does validation to prevent users from crossing accounts.
    // We also do a domain check afterwards just in case.
    const { extract } = await sp.parseLoginResponse(idp, "post", req);

    // log.debug("extract:", extract);
    // log.debug("extract.attributes:", extract.attributes);

    // get the email and groups from the saml response
    const { uid, email, groups } = extract.attributes;
    log.debug("uid:", uid);
    log.debug("email:", email);
    log.debug("groups:", groups);

    // verify the domain in the email matches the account's ssoDomain
    // This check should be redundant because sp.parseLoginResponse performs sp/idp matching, but we do it just in case.
    const emailDomain = email.split("@")[1];
    log.debug("emailDomain:", emailDomain);
    if (emailDomain !== account.ssoDomain) {
      log.error("Email domain does not match account ssoDomain");
      return res.status(401).json({
        message: "Invalid email address.",
      });
    }

    // check the group role mapping in the account
    const samlRoleMapping = account.samlRoleMapping;
    // log.debug("samlRoleMapping:", samlRoleMapping);

    // set the default role to user
    let userRole = "User";

    // define our roles to loop over.
    const roles = ["Admin", "Editor", "User"];

    // loop through our roles array.
    roles.forEach((role) => {
      if (userRole !== "User") {
        // we already have a role, so we don't need to check anymore
        return;
      }
      // log.debug("role:", role);
      // loop through the samlRoleMapping[role] array
      samlRoleMapping[role].forEach((groupInSamlRoleMapping) => {
        // log.debug("groupInSamlRoleMapping:", groupInSamlRoleMapping);
        // if this groupInSamlRoleMapping is in the groups array, set the userRole to the role.
        if (groups.includes(groupInSamlRoleMapping)) {
          userRole = role;
          // we can break out of this nested loop because we found the highest level role.
          return;
        }
      });
    });

    log.debug("userRole:", userRole);

    // generate a token
    const token = generateToken({
      id: uid,
      email: email,
      role: userRole,
      account: accountName,
    });
    log.debug("Token generated");
    log.debug(token);

    // TODO: We should write the saml user to the users collection in the database, so they can manage their settings,
    // and admins can see last login time, role, etc.

    // return the token in the url so the frontend can get it and use it to authenticate future requests.
    res.redirect(`${process.env.WEB_URI}/login/sso/callback?token=${token}`);
  } catch (err) {
    log.error("error:", err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

// /login/sso/metadata
router.get("/metadata", (req, res) => {
  log.debug("/metadata");
  res.header("Content-Type", "text/xml").send(sp.getMetadata());
});

export { router as ssoRouter };
