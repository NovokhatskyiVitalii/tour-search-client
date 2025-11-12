import Container from "../../ui/layout/Container/Container";
import "./TourPage.scss";

const TourPage = () => {
  return (
    <section className="tour-page">
      <Container>
        <div className="tour-page__panel">
          <h1 className="tour-page__title">Деталі туру</h1>
          <p className="tour-page__placeholder">
            Тут з’явиться контент, коли реалізуємо відображення конкретного
            туру.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default TourPage;
