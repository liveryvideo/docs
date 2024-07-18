# [Livery Video Android SDK](/android-sdk#installation-from-bintray)

## Installation from bintray

It is still possible to use bintray repository/credentials for until version 2.0.0.

### Resolve Repositories

In your project level build.gradle file, add these closures to **allprojects** > **repositories**.

```groovy
allprojects {
   repositories {
       //...
       google()
       jcenter()
       maven { url 'https://jitpack.io' }
       maven {
           url "https://exmg.bintray.com/livery"
           credentials {
               username 'received_username'
               password 'bintray_API_key'
           }
       }
   }
}
```

You can get the Bintray API key by following these steps below:

1. Navigate to [Bintray Login](https://bintray.com/login) then login with the credentials given to you.
2. After logging in, go to [Edit Profile](https://bintray.com/profile/edit) from the menu on top right which is shown by clicking to your username.
3. Once you land to Edit Profile page, you should be able to see more menu items on the left. Click to 'API Key' and you will be asked to input your password. After verifying the password, API Key will be shown.

### Add Implementations

Add these implementations inside **dependencies** to your app-level build.gradle.

```groovy
dependencies {
   //...
   implementation 'tv.exmg.livery:livery:2.0.0'
   //...
}
```