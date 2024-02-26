import "../../../styles/search-result.css";

export const SearchResult = ({ data }) => {
  console.log('data search', data);
  return (
    <div className="search-result">
      <a href={`/san-pham/${data.id}`}>
        <div className="sr-item">
          <img className="sr-product-img" src={data.image} />
          <p className="sr-product-name">{data.title}</p>
        </div>
      </a>
    </div>
  );
};
