import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('userStore', () => {

    // -------------------- //

    // ------------- //
    // #region State //
    // ------------- //

    const user = ref({});
    const users = ref([]);
    const bearerToken = ref({});
    const isAuthenticated = ref(false);

    // ------------- //
    // #endregion    //
    // ------------- //

    // -------------------- //

    // --------------- //
    // #region Getters //
    // --------------- //

    const getUser = computed(() => {
        return user.value;
    });

    const getUsers = computed(() => {
        return users.value;
    });

    const getBearerToken = computed(() => {
        return bearerToken.value;
    });

    const getIsAuthenticated = computed(() => {
        return isAuthenticated.value;
    });

    // --------------- //
    // #endregion      //
    // --------------- //

    // -------------------- //

    const base_url = `https://excursions-api-server.azurewebsites.net`;

    // --------------- //
    // #region Actions //
    // --------------- //

    async function createUser(args) {
        const data = { ...args };

        const url = `${base_url}/user`;

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 201) {
                const data = await response.json();

                bearerToken.value = data.token;
                isAuthenticated.value = true;

                await getUserData();
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not create user.");
            }

            if (response.status === 500) {
                throw new Error("Internal Server Error: Could not create user.");
            }
        }

        return response;
    }

    async function getUserData() {
        const token = bearerToken.value;

        const url = `${base_url}/user`;

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                const data = await response.json();

                user.value = data.user;
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not get user.");
            }
            if (response.status === 401) {
                throw new Error("Unauthorized: Could not get user.");
            }
            if (response.stauts === 500) {
                throw new Error("Internal Server Error: Could not get user.");
            }
        }

        return response;
    }

    async function getUsersData() {
        const token = bearerToken.value;

        const url = `${base_url}/users`;

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                const data = await response.json();
                console.log(data);
                users.value = data;
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not get users.");
            }
            if (response.status === 401) {
                throw new Error("Unauthorized: Could not get users.");
            }
            if (response.stauts === 500) {
                throw new Error("Internal Server Error: Could not get users.");
            }
        }

        return response;
    }

    async function updateUser(args) {
        const data = { ...args };
        const token = bearerToken.value;

        const url = `${base_url}/user`;

        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                await getUserData();
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not update user.");
            }

            if (response.status === 500) {
                throw new Error("Internal Server Error: Could not update user.");
            }
        }

        return response;

    }

    async function deleteUser() {
        const token = bearerToken.value;

        const url = `${base_url}/user`;

        const options = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {

                user.value = {};
                bearerToken.value = {};
                isAuthenticated.value = false;

            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not delete user.");
            }

            if (response.status === 401) {
                throw new Error("Unauthorized: Could not delete user.");
            }

            if (response.status === 500) {
                throw new Error("Internal Server Error: Could not delete user.");
            }
        }

        return response;

    }

    async function signUserIn(args) {
        const data = { ...args };

        const url = `${base_url}/user/sign-in`;

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                const data = await response.json();

                bearerToken.value = data.token;
                isAuthenticated.value = true;

                await getUserData();
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not authenticate user.");
            }

            if (response.status === 500) {
                throw new Error("Internal Server Error: Could not authenticate user.");
            }
        }

        return response;
    }

    async function signUserOut() {
        const token = bearerToken.value;

        const url = `${base_url}/user/sign-out`;

        const options = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {

                // TODO: Write function to reset all stores (i.e., steal that shit from Eric)

                user.value = {};

                bearerToken.value = {};
                isAuthenticated.value = false;
            }
        } else {
            throw new Error("HTTP-Error" + response.status);
        }

        return response;
    }

    function $reset() {
        user.value = {};
        bearerToken.value = '';
        isAuthenticated.value = false;
    }

    // --------------- //
    // #endregion      //
    // --------------- //

    // -------------------- //

    return {
        // state
        user,
        users,
        bearerToken,
        isAuthenticated,

        // getters
        getUser,
        getUsers,
        getBearerToken,
        getIsAuthenticated,

        // actions
        createUser,
        updateUser,
        getUserData,
        getUsersData,
        deleteUser,
        signUserIn,
        signUserOut,
        $reset,
    };
});