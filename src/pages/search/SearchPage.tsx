import Container from "../../ui/layout/Container/Container";
import SearchForm from "../../features/search/SearchForm";
import ToursSearchResults from "../../features/search/components/ToursSearchResults";

import "./SearchPage.scss";

const SearchPage = () => {
  return (
    <section className="search-page">
      <Container>
        <div className="search-page__panel">
          <h1 className="search-page__title">Пошук турів</h1>
          <p className="search-page__subtitle">
            Оберіть напрямок подорожі, щоб розпочати пошук найкращих пропозицій.
          </p>

          <SearchForm />
          <ToursSearchResults />
        </div>
      </Container>
    </section>
  );
};

export default SearchPage;
