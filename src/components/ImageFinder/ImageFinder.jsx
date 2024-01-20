import { useState, useEffect } from 'react';
import FinderForm from 'components/FinderForm/FinderForm';
import Searchbar from 'components/Searchbar/Searchbar';
import { searchImages } from 'api/images';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
import Button from 'components/Button/Button';
import Modal from 'components/Modal/Modal';
import Loader from 'components/Loader/Loader';
import css from './ImageFinder.module.css';

const ImageFinder = () => {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadMoreBtn, setLoadMoreBtn] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [alt, setAlt] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const {
          data: { hits, totalHits },
        } = await searchImages(search, page);
        setImages(prevImages =>
          hits?.length ? [...prevImages, ...hits] : prevImages
        );
        const loadedImages = page * 12;
        if (loadedImages >= totalHits) {
          setLoadMoreBtn(false);
          return;
        }
        setLoadMoreBtn(true);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (search) {
      fetchImages();
    }
  }, [search, page]);

  const handleSearch = ({ search: word }) => {
    if (word === search) {
      return;
    }
    setSearch(word);
    setImages([]);
    setPage(1);
  };

  const showModal = e => {
    e.preventDefault();
    setModalOpen(true);
    setLargeImageURL(e.currentTarget.href);
    setAlt(e.target.alt);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const isImages = Boolean(images.length);

  return (
    <>
      <Searchbar>
        <FinderForm onSubmit={handleSearch} />
      </Searchbar>
      {error && <p className={css.error}>{error}</p>}
      {isImages && (
        <ImageGallery>
          <ImageGalleryItem items={images} showModal={showModal} />
        </ImageGallery>
      )}
      {loading && (
        <div className={css.loader}>
          <Loader />
        </div>
      )}
      {isImages && loadMoreBtn && (
        <div className={css.loadMoreContainer}>
          <Button onClick={loadMore} type="button">
            Load more
          </Button>
        </div>
      )}
      {modalOpen && (
        <Modal close={closeModal}>
          <img src={largeImageURL} alt={alt} loading="lazy" />
        </Modal>
      )}
    </>
  );
};

export default ImageFinder;
