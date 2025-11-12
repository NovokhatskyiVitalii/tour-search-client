import "./Main.scss";

const Main = ({ children }: { children: React.ReactNode }) => {
  return <main className="app-content">{children}</main>;
};

export default Main;
