import "./Header.scss";

import Container from "../Container/Container";

const Header = () => {
  return (
    <header className="app__header">
      <Container>
        <div className="app__brand">Tour Finder</div>
      </Container>
    </header>
  );
};

export default Header;
