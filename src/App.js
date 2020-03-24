import React, { Component } from "react";
import "./App.css";
import SearchBar from "./components/searchBar/SearchBar";
import axios from "axios";
import LoaderPage from "./components/loader/Loader";
import ImageGallery from "./components/imageGallery/ImageGallery";
import Button from "./components/button/Button";
import Modal from "./components/modal/Modal";
const KEY = "15314958-d0cf92c359d8093c04958e4c7";

class App extends Component {
  state = {
    galleryItems: [],
    page: 1,
    searchQuery: "",
    isLoading: false,
    largeImageUrl: null,
    openModal: false
  };

  handleOnSubmit = async e => {
    e.preventDefault();
    await this.setState({ galleryItems: [] });
    await this.handleSubmit();
  };

  componentDidUpdate(prevProps, prevState) {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  }

  buttonMore = async () => {
    await this.setState(prevState => ({ page: prevState.page + 1 }));
    await this.handleSubmit();
  };

  handleChange = e => {
    this.setState({ searchQuery: e.target.value });
  };

  componentDidMount() {
    this.handleSubmit();
  }

  handleSubmit = e => {
    const { page, searchQuery } = this.state;
    this.setState({ isLoading: true });
    axios
      .get(
        `https://pixabay.com/api/?q=${searchQuery}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`
      )
      .then(data =>
        this.setState(prevState => ({
          galleryItems: [...prevState.galleryItems, ...data.data.hits]
        }))
      )
      .finally(() => this.setState({ isLoading: false }));
  };

  setLargeImage = largeImageUrl => {
    this.setState({ largeImageUrl: largeImageUrl });
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState(state => ({ openModal: !state.openModal }));
  };

  render() {
    const { isLoading, galleryItems, searchQuery } = this.state;
    return (
      <div className="App">
        <SearchBar
          handleOnSubmit={this.handleOnSubmit}
          handleChange={this.handleChange}
          searchQuery={searchQuery}
        />
        {isLoading && <LoaderPage />}
        <ImageGallery galleryItems={galleryItems} onOpen={this.setLargeImage} />
        {this.state.openModal && (
          <Modal url={this.state.largeImageUrl} onClose={this.toggleModal} />
        )}
        <Button buttonMore={this.buttonMore} />
      </div>
    );
  }
}

export default App;
