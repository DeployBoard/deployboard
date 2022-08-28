# SAML authentication

The SAML authentication method allows your users to log in to DeployBoard using a SAML compatible single sign-on provider.

!!! Note
Every SAML application _should_ follow the same instructuions, although the steps to create an application within your SAML identity provider will differ slightly.

## Google

### Create an Application

https://support.google.com/a/answer/6087519

1. Log in to the [Google Admin Portal](https://admin.google.com/).

1. Go to the Apps and select **Web and mobile apps**.

1. Click the **Add app** dropdown and select **Add custom SAML app**.

1. Enter a name for the App. We suggest: **DeployBoard** and click **Continue**.

1. Click **Download IdP metadata** and save the .xml file for later. _You can download this later in case you lose it or forget_.

1. Service provider details:
   a. ACS URL: https://auth.deployboard.io/login/sso/callback?account=${YourAccountName}
   a. Entity ID: https://auth.deployboard.io/saml/metadata.xml
   a. Start URL: _leave blank_
   a. Signed response: _leave unchecked_

1. Name ID:
   a. Name ID format: **EMAIL**
   a. Name ID: **Basic Information > Primary email**

1. Click **Continue** to proceed to **Attribute Mapping**

1. You can leave the **Attriutes** section empty.

1. If you are using role mapping from Groups (you should be), add the groups you would like to be able to log into DeployBoard with. You will perform the role mappings in the DeployBoard interface.
   a. Google groups: Add the groups you would like to be able to log into DeployBoard.
   b. App attribute: This should be **Groups**. This is important since DeployBoard looks for this when the user logs in to perform automatic role mapping based on Group membership.

## Okta

### Create an Okta application

TODO: Add instructions

# Role Mapping

In the SSO settings page, you can specify what groups in your SAML identity provider map to Admin, Editor, and User roles within DeployBoard. This means when onboarding a new user, you don't need to manually specify their role within DeployBoard, as it can be mapped back to a group in the identity provider.
