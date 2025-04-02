      // Wait for document to be fully loaded
      document.addEventListener("DOMContentLoaded", function () {
        // Initialize Firebase from the external script
        // Assuming firebaseAPI_DTC14.js contains the initialization

        // DOM Elements
        const profileForm = document.getElementById("profile-form");
        // comment below out for changing profile photo feature from uploading to avatar
        // const profilePicInput = document.getElementById("profile-pic");
        const profilePicPreview = document.getElementById("profile-pic-preview");
        // comment below out for changing profile photo feature from uploading to avatar
        // const uploadBtn = document.getElementById("upload-btn");
        const backBtn = document.getElementById("back-btn");
        const cancelBtn = document.getElementById("cancel-btn");
        const confirmationModal = document.getElementById("confirmation-modal");
        const confirmSaveBtn = document.getElementById("confirm-save");
        const cancelConfirmBtn = document.getElementById("cancel-confirm");
        const notificationToast = document.getElementById("notification-toast");
        const toastContent = document.getElementById("toast-content");

        // Variables to store file data
        let selectedFile = null;
        let fileURL = null;

        // Check if user is logged in
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            // User is signed in, load their profile data
            loadUserProfile(user);
          } else {
            // No user is signed in, redirect to login
            window.location.href = "login.html";
          }
        });

        // Load user profile data
        function loadUserProfile(user) {
          // Set name and email from user auth
          document.getElementById("name").value = user.displayName || "";
          document.getElementById("email").value = user.email || "";

          // Set profile picture if available
          if (user.photoURL) {
            profilePicPreview.src = user.photoURL;
            avatarSelect.value = user.photoURL;   // set drop down to the correct avator
          }

          // Fetch additional user data from Firestore
          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                const userData = doc.data();

                // Fill in form fields with user data
                document.getElementById("phone").value = userData.phone || "";
                document.getElementById("age").value = userData.age || "";
                document.getElementById("bio").value = userData.bio || "";

                // Address fields
                if (userData.address) {
                  document.getElementById("street").value =
                    userData.address.street || "";
                  document.getElementById("apt").value =
                    userData.address.apt || "";
                  document.getElementById("city").value =
                    userData.address.city || "";
                  document.getElementById("state").value =
                    userData.address.state || "";
                  document.getElementById("postal").value =
                    userData.address.postal || "";
                  document.getElementById("country").value =
                    userData.address.country || "";
                }

                // Shopping preferences checkboxes
                if (
                  userData.preferences &&
                  Array.isArray(userData.preferences)
                ) {
                  userData.preferences.forEach((preference) => {
                    const checkbox = document.getElementById(preference);
                    if (checkbox) checkbox.checked = true;
                  });
                }

                // Group shopping settings
                if (userData.groupSettings) {
                  document.getElementById("max-distance").value =
                    userData.groupSettings.maxDistance || 10;
                  document.getElementById("group-size").value =
                    userData.groupSettings.groupSize || "4-6";
                }

                // Notification preferences
                if (userData.notifications) {
                  document.getElementById("notification-email").checked =
                    userData.notifications.email !== false;
                  document.getElementById("notification-sms").checked =
                    userData.notifications.sms === true;
                  document.getElementById("notification-push").checked =
                    userData.notifications.push !== false;
                }
              }
            })
            .catch((error) => {
              console.error("Error loading user data:", error);
              showNotification(
                "Error loading profile data. Please try again.",
                "error"
              );
            });
        }

        // comment below out for changing profile photo feature from uploading to avatar

        // Handle profile picture upload
        // uploadBtn.addEventListener("click", function () {
        //   profilePicInput.click();
        // });
        //
        // profilePicInput.addEventListener("change", function (event) {
        //   selectedFile = event.target.files[0];
        //
        //   if (selectedFile) {
        //     // Check file size (max 2MB)
        //     if (selectedFile.size > 2 * 1024 * 1024) {
        //       showNotification(
        //         "File is too large. Maximum size is 2MB.",
        //         "error"
        //       );
        //       return;
        //     }
        //
        //     // Preview the image
        //     const reader = new FileReader();
        //     reader.onload = function (e) {
        //       profilePicPreview.src = e.target.result;
        //     };
        //     reader.readAsDataURL(selectedFile);
        //   }
        // });


        // Add the avatar selection dropdown-list feature
        const avatarOptions = [
          { path: "images/avatar/avatar1.png", name: "Avatar 1" },
          { path: "images/avatar/avatar2.png", name: "Avatar 2" },
          { path: "images/avatar/avatar3.png", name: "Avatar 3" },
          { path: "images/avatar/avatar4.png", name: "Avatar 4" },
          { path: "images/avatar/avatar5.png", name: "Avatar 5" },
          { path: "images/avatar/avatar6.png", name: "Avatar 6" },
          { path: "images/avatar/avatar7.png", name: "Avatar 7" },
          { path: "images/avatar/avatar8.png", name: "Avatar 8" },
          // Add more avatars as needed
        ];

        const avatarSelect = document.getElementById("avatar-select");

        function populateAvatarDropdown() {
          avatarOptions.forEach((avatar) => {
            const option = document.createElement("option");
            option.value = avatar.path;
            option.textContent = avatar.name;

            option.style.backgroundImage = `url(${avatar.path})`;
            option.style.backgroundSize = "20px 20px";
            option.style.backgroundRepeat = "no-repeat";
            option.style.paddingLeft = "25px"; // Add spacing for image
            avatarSelect.appendChild(option);
          });
        }

        populateAvatarDropdown();

        avatarSelect.addEventListener("change", function () {
          const selectedAvatar = avatarSelect.value;
          document.getElementById("profile-pic-preview").src = selectedAvatar;
        });



        // Handle form submission
        profileForm.addEventListener("submit", function (event) {
          event.preventDefault();

          // Show confirmation modal
          confirmationModal.classList.remove("hidden");
        });

        // Confirm save changes
        confirmSaveBtn.addEventListener("click", function () {
          // Hide confirmation modal
          confirmationModal.classList.add("hidden");

          // Get current user
          const user = firebase.auth().currentUser;
          if (!user) {
            showNotification("You must be logged in to save changes.", "error");
            return;
          }

          // Show loading notification
          showNotification("Saving your profile...", "loading");


          // comment below out for changing profile photo feature from uploading to avatar

          // First upload profile picture if selected
          // let updateProfilePromise = Promise.resolve();
          // if (selectedFile) {
          //   const storageRef = firebase.storage().ref();
          //   const fileRef = storageRef.child(`profile_pictures/${user.uid}`);
          //
          //   updateProfilePromise = fileRef
          //     .put(selectedFile)
          //     .then((snapshot) => snapshot.ref.getDownloadURL())
          //     .then((downloadURL) => {
          //       fileURL = downloadURL;
          //       // Update user profile with photo URL
          //       return user.updateProfile({
          //         photoURL: downloadURL,
          //       });
          //     });
          // }

          // Get selected avatar URL
          const selectedAvatar = document.getElementById("avatar-select").value; // Get selected avatar


          // Update profile data
          user.updateProfile
            ({
              photoURL: selectedAvatar, // update profile with selected avator
            })
            .then(() => {
              // Update display name
              return user.updateProfile({
                displayName: document.getElementById("name").value,
              });
            })
            .then(() => {
              // Update email if changed
              const newEmail = document.getElementById("email").value;
              if (newEmail !== user.email) {
                return user.updateEmail(newEmail);
              }
              return Promise.resolve();
            })
            .then(() => {
              // Get all checkbox preferences
              const checkboxes = document.querySelectorAll(
                'input[name="preferences"]:checked'
              );
              let preferences = [];
              checkboxes.forEach((checkbox) => {
                preferences.push(checkbox.value);
              });

              // Get notification preferences
              const notifications = {
                email: document.getElementById("notification-email").checked,
                sms: document.getElementById("notification-sms").checked,
                push: document.getElementById("notification-push").checked,
              };

              // Prepare user data object
              const userData = {
                name: document.getElementById("name").value, // Add this line

                phone: document.getElementById("phone").value,
                age: document.getElementById("age").value,
                bio: document.getElementById("bio").value,
                address: {
                  street: document.getElementById("street").value,
                  apt: document.getElementById("apt").value,
                  city: document.getElementById("city").value,
                  state: document.getElementById("state").value,
                  postal: document.getElementById("postal").value,
                  country: document.getElementById("country").value,
                },
                preferences: preferences,
<<<<<<< HEAD
                photoURL: selectedAvatar,
=======
                photoURL:selectedAvatar,
>>>>>>> temp-branch
                groupSettings: {
                  maxDistance: document.getElementById("max-distance").value,
                  groupSize: document.getElementById("group-size").value,
                },
                notifications: notifications,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              };

              // Save to firestore
              return firebase
                .firestore()
                .collection("users")
                .doc(user.uid)
                .set(userData, { merge: true });
            })
            .then(() => {
              showNotification("Profile updated successfully!", "success");
              // comment below out for changing profile photo feature from uploading to avatar
              // Reset the file selection
              // selectedFile = null;
              // profilePicInput.value = "";
            })
            .catch((error) => {
              console.error("Error updating profile:", error);
              showNotification(
                "Error updating profile: " + error.message,
                "error"
              );
            });
        });

        // Cancel confirmation
        cancelConfirmBtn.addEventListener("click", function () {
          confirmationModal.classList.add("hidden");
        });

        // Cancel button - go back without saving
        cancelBtn.addEventListener("click", function () {
          window.location.href = "home.html";
        });

        // Back button - go back without saving
        backBtn.addEventListener("click", function () {
          window.location.href = "home.html";
        });

        // Show notification function
        function showNotification(message, type) {
          // Create notification content based on type
          let iconHTML = "";
          let bgColor = "";

          switch (type) {
            case "success":
              iconHTML =
                '<svg class="w-6 h-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
              bgColor = "bg-green-600";
              break;
            case "error":
              iconHTML =
                '<svg class="w-6 h-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
              bgColor = "bg-red-600";
              break;
            case "loading":
              iconHTML =
                '<svg class="animate-spin h-6 w-6 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
              bgColor = "bg-blue-600";
              break;
            default:
              iconHTML =
                '<svg class="w-6 h-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
              bgColor = "bg-gray-600";
          }

          // Set notification content
          toastContent.innerHTML = `${iconHTML}<span class="text-white">${message}</span>`;

          // Set background color
          notificationToast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-opacity duration-300 ${bgColor}`;

          // Show the notification
          notificationToast.classList.remove("hidden");
          setTimeout(() => {
            notificationToast.classList.remove("opacity-0");
          }, 10);

          // Hide after 5 seconds (unless it's a loading notification)
          if (type !== "loading") {
            setTimeout(() => {
              notificationToast.classList.add("opacity-0");
              setTimeout(() => {
                notificationToast.classList.add("hidden");
              }, 300);
            }, 5000);
          }
        }
      });
