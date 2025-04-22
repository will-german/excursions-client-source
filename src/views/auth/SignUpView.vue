<script setup>
    import { ref, watchEffect } from 'vue';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '@/stores/userStore';

    import { FormInput, FormButton, FontAwesomeIcon } from '@/components/exporter';

    const router = useRouter();

    const userName = ref('');
    const fullName = ref('');
    const email = ref('');
    const password = ref('');

    watchEffect(() => {
        // TODO: Dynamic form validation
    });

    const userStore = useUserStore();

    async function signUp() {

        // TODO: Validate final form values before API call

        const name = fullName.value.split(" ");

        if (!name[0] || !name[1]) {
            // TODO: Toast user
            throw new Error("Full name is required.");
        }

        const data = {
            userName: userName.value,
            firstName: name[0],
            lastName: name[1],
            email: email.value,
            password: password.value,
        };

        if (name.length > 2) {
            data.firstName = name[0];
            data.lastName = name[name.length - 1];
        }

        let response = await userStore.createUser(data);

        if (response.ok) {
            if (response.status === 201) {

                // TODO: Toast User

                // TODO: Prefetch Park Summaries

                router.push({
                    name: 'search'
                });
            } else {
                if (response.status === 400) {
                    // TODO: Handle
                    console.log(response);
                }

                if (response.status === 500) {
                    // TODO: Handle
                    console.log(response);
                }
            }
        }

    }

</script>

<template>
    <main class="grid">
        <!--
            TODO: Implement image from multimedia endpoints as background
        -->
        <div class="sidebar grid--content-center">
            <!--
                TODO: Convert Sidebar to Component
            -->
            <h1 class="heading">Sign Up</h1>

            <form action=""
                  class="form">

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

                <FormInput label="full name"
                           type="text"
                           name="fullName"
                           placeholder="Joe User"
                           required="true"
                           v-model="fullName">
                    <template #icon>
                        <font-awesome-icon icon="fa-solid fa-user-secret" />
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

                <!--
                    TODO: Implement password criteria tooltip
                -->
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

                <FormButton text="Sign Up"
                            type="submit"
                            customClasses="button--dark--solid--square"
                            @click.prevent.stop="signUp()">
                </FormButton>
            </form>

            <!--
                TODO: Utilize router.back()
            -->
            <RouterLink to="/"
                        class="button">
                <font-awesome-icon icon="fa-solid fa-arrow-left" />
            </RouterLink>
        </div>
    </main>

</template>

<style lang="scss"
       scoped>

    @use '@/sass/abstracts' as *;

    .sidebar {
        --gap: #{$gap-lg};

        width: 100%;
        max-width: 48rem;

        grid-template-rows: repeat(auto-fit, minmax(0, max-content));
        justify-self: end;

        background: var(--neutral-100);

        box-shadow: -4px 4px 8px 0px rgba(0, 0, 0, 0.50);

        position: relative;
    }

    .sidebar > .form {
        flex-direction: column;
    }

    .sidebar > button {
        width: 100%;
    }

    .sidebar > a[class*="button"] {
        position: absolute;
        top: 0;
        left: 0;

        color: $text-inverse;
    }

    .heading {
        color: $text-inverse;
        text-align: center;
    }

</style>