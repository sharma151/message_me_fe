
# Getting Started

To run this application:

```bash
yarn install
yarn run dev
```

# Building For Production

To build this application for production:

```bash
yarn run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
yarn run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting


This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
yarn run lint
yarn run format
yarn run check
```

## Folder Structure 

# File Tree: src

```
├── @types
│   ├── forms
│   │   └── auth.d.ts
│   └── response
│       └── api-response.d.ts
├── Layout
│   └── AppLayout.tsx
├── assets
│   ├── addchatIconwhite.png
│   ├── addchaticon.png
│   ├── chatIcon.png
│   ├── default-user.webp
│   ├── emojiview.png
│   ├── inbox-bg.png
│   └── logo.png
├── components
│   ├── ActionBar
│   │   └── index.tsx
│   ├── AllUserList
│   │   └── index.tsx
│   ├── AvailableUsers
│   │   └── index.tsx
│   ├── ChatEmojiPicker
│   │   └── index.tsx
│   ├── ChatInputBar
│   │   └── index.tsx
│   ├── ChatRoomNav
│   │   └── index.tsx
│   ├── ChatRoomPage
│   │   └── ChatRoomPage.tsx
│   ├── CustomDropdown
│   │   └── index.tsx
│   ├── DefaultUserIcon
│   │   └── index.tsx
│   ├── ProgressLoader
│   │   └── index.tsx
│   ├── SideBar
│   │   └── index.tsx
│   ├── SideBarNav
│   │   └── index.tsx
│   ├── UI
│   │   ├── dropdown-menu.tsx
│   │   ├── popover.tsx
│   │   └── tabs.tsx
│   ├── UserDetailActionbutton
│   │   └── index.tsx
│   └── UserProfileDetails
│       └── index.tsx
├── core
│   ├── hooks
│   │   ├── api
│   │   │   ├── useAuth.ts
│   │   │   └── useChat.ts
│   │   └── common
│   │       ├── useActiveChat.tsx
│   │       └── useToast.tsx
│   └── services
│       ├── auth.service.ts
│       ├── chat.service.ts
│       └── httpBase.ts
├── lib
│   └── utils.ts
├── routes
│   ├── auth
│   │   ├── forgotPassword.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── chats
│   │   ├── $chatId.tsx
│   │   └── index.tsx
│   ├── __root.tsx
│   └── index.tsx
├── socket
│   └── socket.ts
├── store
│   ├── auth.store.ts
│   └── modal.store.ts
├── utils
│   └── http.utils.ts
├── main.tsx
├── reportWebVitals.ts
├── routeTree.gen.ts
└── styles.css
```
