## <a name="features">🔋 Features</a>

👉 **Authentication**: Secure sign-in with NextAuth, supporting Email/Password, Google, and GitHub.
-- If User uses Github oAuth, we will create an Account containing Github oAuth Info and then create a User with a Github name,usernmae and image.
-- if User uses Google oAuth, we will create an Account containing Google oAuth Info and then create a User with a Google name,usernmae and image.

-   Ig User uses Github or Google oAuth first and others later, we will create that oAuth ccoutn and update the User info to show the latest oAuth name and image.The username will stay the same.
