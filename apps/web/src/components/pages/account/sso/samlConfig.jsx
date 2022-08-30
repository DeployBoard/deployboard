import { useState, useEffect } from "react";
import axios from "axios";
import xml2js from "xml2js";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box } from "@mui/system";
import { LinearProgress, Checkbox, TextField, Typography } from "@mui/material";

import { getToken } from "../../../utils/auth";
import CustomSnackbar from "../../../structure/customSnackbar";

const SamlConfig = () => {
  const [samlEnabled, setSamlEnabled] = useState(false);
  const [samlDomain, setSamlDomain] = useState("");
  const [metadataXml, setMetadataXml] = useState("");
  const [adminGroups, setAdminGroups] = useState("");
  const [editorGroups, setEditorGroups] = useState("");
  const [userGroups, setUserGroups] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const getAccount = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URI}/accounts`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        // if auth is saml set enabled to true
        if (res.data.auth === "saml") {
          setSamlEnabled(true);
        }
        // if we have an ssoDomain, set it.
        if (res.data.ssoDomain) {
          setSamlDomain(res.data.ssoDomain);
        }

        // parse the metadata xml
        if (res.data.samlConfig) {
          const builder = new xml2js.Builder();
          const metadataXmlString = builder.buildObject(res.data.samlConfig);
          setMetadataXml(metadataXmlString);
        }

        // set the groups if we have them
        if (res.data.samlRoleMapping) {
          if (res.data.samlRoleMapping.Admin) {
            setAdminGroups(JSON.stringify(res.data.samlRoleMapping.Admin));
          }
          if (res.data.samlRoleMapping.Editor) {
            setEditorGroups(JSON.stringify(res.data.samlRoleMapping.Editor));
          }
          if (res.data.samlRoleMapping.User) {
            setUserGroups(JSON.stringify(res.data.samlRoleMapping.User));
          }
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    try {
      await handleSubmitSamlConfig();
      await handleSubmitSamlSettings();
      setSuccess("Successfully updated SAML settings");
    } catch (err) {
      console.log(err);
      setError(err);
    }
    setLoading(false);
  };

  const handleSubmitSamlConfig = async () => {
    // make the api call
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/accounts/samlConfig`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${getToken()}`,
          },
          body: metadataXml,
        }
      );
      const { message } = await response.json();
      return message;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  };

  const handleSubmitSamlSettings = async () => {
    // json parse our literal string arrays
    const adminGroupsArray = JSON.parse(adminGroups);
    const editorGroupsArray = JSON.parse(editorGroups);
    const userGroupsArray = JSON.parse(userGroups);

    // make the api call
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/accounts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            ssoDomain: samlDomain,
            auth: samlEnabled ? "saml" : "local",
            samlRoleMapping: {
              Admin: adminGroupsArray,
              Editor: editorGroupsArray,
              User: userGroupsArray,
            },
          }),
        }
      );
      const { message } = await response.json();
      return message;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

  if (loading) return <LinearProgress />;

  return (
    <>
      {error && <CustomSnackbar severity="error" message={error} />}
      {success && <CustomSnackbar severity="success" message={success} />}
      <Typography variant="h5">SAML Config</Typography>
      <Box
        display="flex"
        justifyContent="left"
        alignItems="center"
        sx={{ mt: 2 }}
      >
        <Typography>SAML Enabled</Typography>
        <Checkbox
          checked={samlEnabled}
          onChange={(event) => setSamlEnabled(event.target.checked)}
        />
      </Box>
      <TextField
        fullWidth
        label="Email Domain"
        value={samlDomain}
        onChange={(event) => setSamlDomain(event.target.value)}
        sx={{ mt: 2 }}
      />
      <TextField
        fullWidth
        multiline
        minRows={4}
        maxRows={10}
        label="metadata.xml"
        value={metadataXml}
        onChange={(event) => setMetadataXml(event.target.value)}
        sx={{ mt: 2 }}
      />
      <TextField
        fullWidth
        label="Admin Groups"
        value={adminGroups}
        onChange={(event) => setAdminGroups(event.target.value)}
        sx={{ mt: 2 }}
      />
      <TextField
        fullWidth
        label="Editor Groups"
        value={editorGroups}
        onChange={(event) => setEditorGroups(event.target.value)}
        sx={{ mt: 2 }}
      />
      <TextField
        fullWidth
        label="User Groups"
        value={userGroups}
        onChange={(event) => setUserGroups(event.target.value)}
        sx={{ mt: 2 }}
      />
      <br />

      <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </Box>
    </>
  );
};

export default SamlConfig;
