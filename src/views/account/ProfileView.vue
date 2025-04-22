<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '@/stores/userStore';
    import { FormInput, FormButton, FontAwesomeIcon } from '@/components/exporter';

    const router = useRouter();

    const userStore = useUserStore();

    const user = ref({});

    const userName = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');

    const isEditing = ref(false);
    const inputs = ref([]);

    onMounted(async () => {
        user.value = userStore.getUser;

        userName.value = user.value.userName;
        firstName.value = user.value.firstName;
        lastName.value = user.value.lastName;
        email.value = user.value.email;

        const elements = document.querySelectorAll('.field_input');

        elements.forEach(element => {
            element.setAttribute('disabled', '');
        });

        inputs.value = elements;
    });

    function ToggleEditing() {
        isEditing.value = !isEditing.value;

        if (isEditing.value) {
            inputs.value.forEach(input => {
                input.removeAttribute('disabled');
            });
        } else {
            inputs.value.forEach(input => {
                input.setAttribute('disabled', '');
            });

            userName.value = user.value.userName;
            firstName.value = user.value.firstName;
            lastName.value = user.value.lastName;
            email.value = user.value.email;
        }
    }

    async function updateProfile() {

        const data = {
            "userName": userName.value,
            "firstName": firstName.value,
            "lastName": lastName.value,
            "email": email.value,
            "password": password.value,
        };

        for (const [key, value] of Object.entries(data)) {
            if (!value) {
                delete data[key];
            }
        }

        let response = await userStore.updateUser(data);

        if (response.status === 200) {
            // TODO: Toast User
            console.log("Updated Profile");
        } else {
            // TODO: Toast User
        }
    }

    async function deleteAccount() {

        if (true) {
            console.log("PROG BLOCK ON ACCOUNT DELETE");
            return;
        }

        let response = await userStore.deleteUser();

        if (response.status === 200) {
            console.log("DELETED");

            // TODO: Toast User

            router.push({
                "name": "home",
            });
        }
    }

</script>

<template>
    <div id="wrapper"
         class="grid">
        <main class="">
            <section class="section section--header">
                <h1 class="title">Profile</h1>
                <p>Manage your profile data.</p>
            </section>
            <section class="section section--body">
                <form action=""
                      class="form grid">

                    <FormInput label="username"
                               type="text"
                               name="userName"
                               placeholder="JoeUser2k"
                               required="true"
                               v-model="userName">
                        <template #icon>
                            <font-awesome-icon icon="fa-solid fa-user" />
                        </template>
                    </FormInput>

                    <FormInput label="first name"
                               type="text"
                               name="firstName"
                               placeholder="Joe"
                               required="true"
                               v-model="firstName">
                        <template #icon>
                            <font-awesome-icon icon="fa-solid fa-envelope" />
                        </template>
                    </FormInput>

                    <FormInput label="last name"
                               type="text"
                               name="lastName"
                               placeholder="joe@user.com"
                               required="true"
                               v-model="lastName">
                        <template #icon>
                            <font-awesome-icon icon="fa-solid fa-envelope" />
                        </template>
                    </FormInput>

                    <FormInput label="email"
                               type="email"
                               name="email"
                               placeholder="joe@user.com"
                               required="true"
                               v-model="email">
                        <template #icon>
                            <font-awesome-icon icon="fa-solid fa-envelope" />
                        </template>
                    </FormInput>

                    <FormInput label="password"
                               type="password"
                               name="password"
                               placeholder="Testing1234!"
                               required="true"
                               v-model="password">
                        <template #icon>
                            <font-awesome-icon icon="fa-solid fa-key" />
                        </template>
                    </FormInput>

                    <!-- <FormButton text="Update Profile"
                                type="submit"
                                customClasses="button--dark--solid--square"
                                @click.prevent.stop="updateProfile()">
                    </FormButton> -->

                </form>
            </section>
            <section class="section section--footer">

            </section>
        </main>
        <aside class="profile_actions">
            <ul class="grid"
                role="list">
                <li id="edit"
                    v-show="!isEditing">
                    <FormButton text="Enable Editing"
                                type="button"
                                customClasses="button--light--outline--square"
                                @click="ToggleEditing()">
                        <template #prefix-icon>
                            <font-awesome-icon icon="fa-solid fa-pencil" />
                        </template>
                    </FormButton>
                </li>
                <li id="update"
                    v-show="isEditing">
                    <FormButton text="Save Changes"
                                type="button"
                                customClasses="button--dark--solid--square"
                                @click.prevent.stop="updateProfile()">
                        <template #prefix-icon>
                            <font-awesome-icon icon="fa-solid fa-floppy-disk" />
                        </template>
                    </FormButton>
                </li>
                <li id="cancel"
                    v-show="isEditing">
                    <FormButton text="Cancel"
                                type="button"
                                customClasses="button--light--outline--square"
                                @click="ToggleEditing()">
                        <template #prefix-icon>
                            <font-awesome-icon icon="fa-solid fa-ban" />
                        </template>
                    </FormButton>
                </li>
                <li id="delete"
                    v-show="!isEditing">
                    <FormButton text="Delete Account"
                                type="button"
                                customClasses="button--dark--solid--square"
                                @click.prevent.stop="deleteAccount()">
                        <template #prefix-icon>
                            <font-awesome-icon icon="fa-solid fa-trash" />
                        </template>
                    </FormButton>
                </li>
            </ul>
        </aside>
    </div>
</template>

<style lang="scss"
       scoped>

    @use "@/sass/abstracts" as *;

    #wrapper {
        --gap: calc(#{$gap-xl} * 2);
        grid-template-columns: repeat(2, minmax(0, max-content));
        padding-inline: $padding-xl;
    }

    main {
        width: 100%;
        min-width: 32rem;
        max-width: 64rem;
    }

    .section {
        position: relative;
    }

    .form {
        --gap: #{$gap-xl};
        grid-template-columns: repeat(2, minmax(0, 1fr));

        padding-block: $padding-xl;
    }

    .form > :where(*:nth-child(1), *:nth-child(4), *:nth-child(5)) {
        grid-column: 1 / span 2;
    }

    .form > :where(*:nth-child(6)) {
        width: 50%; // how not to css 101
        grid-column: 1 / span 2;
        place-self: center;
        margin-top: $margin;
    }

    .form > .field {
        --gap: 0;
        // --label-color: #{$text};
        --label-color: var(--primary-400);
    }

    .profile_actions {
        --gap: #{$gap-lg};
        min-width: 24rem;

        padding-block: calc($padding-xl * 4.675);
    }

    .profile_actions [class*="button"] {}

    .profile_actions #edit [class*="button"] {
        --_bg: transparent;
        --_color: #{$text};
        --_border-color: #{$bg-inverse};
    }

    .profile_actions #update [class*="button"] {
        --_bg: transparent;
        --_color: var(--primary-400);
        --_border-color: var(--primary-400);
    }

    .profile_actions #delete [class*="button"],
    .profile_actions #cancel [class*="button"] {
        --_bg: transparent;
        --_color: var(--semantic-error-400);
        --_border-color: var(--semantic-error-400);
    }

</style>