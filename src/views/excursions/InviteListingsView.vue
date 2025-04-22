<script setup>
    import { ref, onMounted, useTemplateRef } from 'vue';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '@/stores/userStore';
    import { useExcursionStore } from '@/stores/excursionStore';
    import { FontAwesomeIcon } from '@/components/exporter';

    const userStore = useUserStore();
    const excursionStore = useExcursionStore();

    const user = ref(userStore.getUser);

    const incoming = ref([]);
    const outgoing = ref([]);

    onMounted(async () => {
        await GetInvites();
    });

    async function GetInvites() {
        const token = userStore.getBearerToken;
        const url = `https://excursions-api-server.azurewebsites.net/share/excursions`;

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

                let invites = data.excursionInvites;
                invites.forEach(invite => {
                    if (invite.sender[0]._id === user.value._id) {
                        outgoing.value.push(invite);
                    } else {
                        incoming.value.push(invite);
                    }
                });
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not get invites.");
            }

            if (response.status === 401) {
                throw new Error("Unauthorized: Could not get invites.");
            }

            if (response.status === 500) {
                throw new Error("Internal Server Error: Could not get invites.");
            }
        }

    }

    async function AcceptInvite(inviteId) {
        const token = userStore.getBearerToken;
        const url = `https://excursions-api-server.azurewebsites.net/share/excursions/{inviteId}`;

        const data = {
            isAccepted: true,
        };

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
                await GetInvites();
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not handle invite.");
            }

            if (response.status === 401) {
                throw new Error("Unauthorized: Could not handle invite.");
            }

            if (response.status === 500) {
                throw new Error("Internal Server Error: Could not handle invite.");
            }
        }
    }

    async function DeclineInvite(inviteId) {
        const token = userStore.getBearerToken;
        const url = `https://excursions-api-server.azurewebsites.net/share/excursions/{inviteId}`;

        const data = {
            isAccepted: false,
        };

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
                await GetInvites();
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not handle invite.");
            }

            if (response.status === 401) {
                throw new Error("Unauthorized: Could not handle invite.");
            }

            if (response.status === 500) {
                throw new Error("Internal Server Error: Could not handle invite.");
            }
        }
    }

    async function RevokeInvite(inviteId) {
        const token = userStore.getBearerToken;
        const url = `https://excursions-api-server.azurewebsites.net/share/excursions/{inviteId}`;

    }

</script>

<template>
    <div id="wrapper"
         class="grid">

        <main class="">
            <section class="section section--header">
                <h1 class="title">Excursion Invites</h1>
                <p>Manage invitiations to excursions.</p>
            </section>

            <section class="section section--body"
                     v-if="incoming.length > 0">
                <h2 class="subheading">Incoming Invites</h2>
            </section>

            <ul class="invite_card_list flex--col"
                role="list"
                v-if="incoming.length > 0">
                <li v-for="invite in incoming">
                    <div class="invite_card">
                        <div class="invite_card_body flex--col">
                            <h3 class="invite_card_title">
                                {{ invite.excursion[0].name }}
                            </h3>
                            <p class="invite_card_user">
                                <font-awesome-icon icon="fa-solid fa-user" />
                                {{ invite.sender[0].firstName }}
                                {{ invite.sender[0].lastName }}
                            </p>
                        </div>
                        <div class="invite_card_actions flex--col">
                            <button type="button"
                                    class="invite_card_button"
                                    @click.prevent.stop="AcceptInvite(invite._id)">
                                <font-awesome-icon icon="fa-solid fa-check" />
                                Accept
                            </button>
                            <button type="button"
                                    class="invite_card_button"
                                    @click.prevent.stop="DeclineInvite(invite._id)">
                                <font-awesome-icon icon="fa-solid fa-xmark" />
                                Decline
                            </button>
                        </div>
                    </div>
                </li>
            </ul>

            <section class="section section--body"
                     v-if="outgoing.length > 0">
                <h2 class="subheading">Outgoing Invites</h2>
            </section>

            <ul class="invite_card_list flex--col"
                role="list"
                v-if="outgoing.length > 0">
                <li v-for="invite in outgoing">
                    <div class="invite_card">
                        <div class="invite_card_body flex--col">
                            <h3 class="invite_card_title">
                                {{ invite.excursion[0].name }}
                            </h3>
                            <p class="invite_card_user">
                                <font-awesome-icon icon="fa-solid fa-user" />
                                {{ invite.receiver[0].firstName }}
                                {{ invite.receiver[0].lastName }}
                            </p>
                        </div>
                        <div class="invite_card_actions invite_card_actions--revoke grid">
                            <button type="button"
                                    class="invite_card_button"
                                    @click.prevent.stop="RevokeInvite(invite._id)">
                                <font-awesome-icon icon="fa-solid fa-ban" />
                                Revoke
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </main>

    </div>
</template>

<style lang="scss"
       scoped>

    @use "@/sass/abstracts" as *;

    // #region invite card

    .invite_card {
        width: 100%;
        max-width: 48rem;

        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, max-content);
        gap: $gap;

        background: $bg-inverse;
        color: $text-inverse;

        padding: $padding;

        border: $border-width-default $border-style-default var(--neutral-400);
        border-radius: $border-radius-default;

        box-shadow: $box-shadow-default;
    }

    .invite_card_body {
        gap: $gap-sm;
    }

    .invite_card_title {
        color: $text-inverse;

        font-size: $fs-subheading;
        font-weight: $fw-semibold;
    }

    .invite_card_user {
        display: flex;
        flex-direction: row;
        gap: $gap-sm;
        align-items: center;

        text-transform: capitalize;
    }

    .invite_card_user > i {
        color: var(--primary-400);
    }

    .invite_card_actions {
        gap: $gap-sm;
    }

    .invite_card_actions > .invite_card_button:first-child {
        --_color: var(--primary-600);
        --_border-color: var(--_color);
    }

    .invite_card_actions > .invite_card_button:last-child {
        --_color: var(--semantic-error-600);
        --_border-color: var(--_color);
    }

    .invite_card_button {
        --_color: #{$text-inverse};
        --_border-color: transparent;

        background: transparent;
        color: var(--_color);

        display: flex;
        flex-direction: row;
        gap: $gap-sm;

        align-items: center;
        justify-content: center;

        padding: $padding-xs;
        border: $border-width-default $border-style-default var(--_border-color);
        border-radius: $border-radius-default;

        cursor: pointer;
    }

    .invite_card_actions--revoke {
        place-content: center;
    }

    // #endregion


    .invite_card_list {
        --gap: #{$gap};
        padding-block: $padding-xl;
    }

    .section--body {
        padding-top: $padding-xl;
    }

    .subheading {
        font-weight: $fw-bold;
        padding-bottom: $padding-xs;
    }
</style>