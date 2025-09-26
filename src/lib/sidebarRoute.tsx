export const sidebarRoute = (user) => [
    {
        name: "home",
        icon: "eva:home-fill",
        route: "/",
    },
    {
        name: "My profile",
        icon: "bi:person-fill",
        route: `/profile/${user?.id}`,
    },
    {
        name: "messages",
        icon: "eva:message-circle-fill",
        route: "/messages",
    }
]