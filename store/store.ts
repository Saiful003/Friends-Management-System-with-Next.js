import { configureStore } from "@reduxjs/toolkit";
import drawerSlice from "../features/drawerSlice";
import modalSlice from "../features/modalSlice";
import themeSlice from "../features/themeSlice";

const store = configureStore({
  reducer: {
    myDrawer: drawerSlice,
    siteTheme: themeSlice,
    myModal: modalSlice,
  },
});
export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
