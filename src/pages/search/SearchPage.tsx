import Container from "../../ui/layout/Container/Container";
import "./SearchPage.scss";

const SearchPage = () => {
  return (
    <section className="search-page">
      <Container>
        <div className="search-page__panel">
          <h1 className="search-page__title">Форма пошуку турів</h1>
          <p className="search-page__placeholder"></p>
        </div>
      </Container>
    </section>
  );
};

export default SearchPage;
