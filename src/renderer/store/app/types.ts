export interface AppState {
  isAuth: boolean;
  loadState: {
    [key: string]: boolean;
    app: boolean;
  };
}
