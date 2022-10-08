import React, { useState, useEffect } from 'react';
import carouselImage1 from '../assets/images/aot-carousel-pic.png'
import carouselImage2 from '../assets/images/demon-slayer-carousel-pic.png';
import carouselImage3 from '../assets/images/kaisen-carousel-pic.png';
import mobileCarouselImg1 from '../assets/images/mobilePic1.jpg';
import mobileCarouselImg2 from '../assets/images/mobilePic2.jpg';
import mobileCarouselImg3 from '../assets/images/mobilePic3.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import '../css/home.css';
import Slider, { Settings } from 'react-slick';
import { Link } from 'react-router-dom';


const HomeCarousel = () => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomButtonLeft />,
    nextArrow: <CustomButtonRight />
  }

  return (
    <>
      <Slider {...settings} className='carousel'>
        <div className='img-wrapper'>
          <picture>
            <source media='(max-width: 688px)' srcSet={mobileCarouselImg1} />
            <img src={carouselImage1} alt='Carousel item Attack on Titan'></img>
          </picture>
        </div>
        <div className='img-wrapper'>
          <picture>
            <source media='(max-width: 688px)' srcSet={mobileCarouselImg2} />
            <img src={carouselImage2} alt='Carousel item Demon Slayer'></img>
          </picture>
        </div>
        <div className='img-wrapper'>
          <picture>
            <source media='(max-width: 688px)' srcSet={mobileCarouselImg3} />
            <img src={carouselImage3} alt='Carousel item JJK'></img>
          </picture>
        </div>
      </Slider>
    </>
  )
}

const CustomButtonLeft = (props: any) => {
  const { className, onClick } = props;
  return ( 
    <>
      <FontAwesomeIcon className={className} style={{ display: 'block'}} onClick={onClick} icon={faChevronLeft} />
    </>
  )
}

const CustomButtonRight = (props: any) => {
  const { className, onClick } = props;
  return ( 
    <>
      <FontAwesomeIcon className={className} style={{ display: 'block'}} onClick={onClick} icon={faChevronRight} />
    </>
  )
}

const HomeSuggestedBooksCarousel = () => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: <CustomButtonLeft />,
    nextArrow: <CustomButtonRight />
  }

  return (
    <>
      <Slider {...settings}>
        <div className='img-wrapper'>
          <Link to='/Chainsaw-Man-Manga-Volume-6'>
            <img src='images/book_images/big/Chainsaw Man Manga Volume 6_lg.jpg'
              alt='Suggested Book 1' />
          </Link>
        </div>
        <div className='img-wrapper'>
          <Link to='/Inside-Mari-Manga-Volume-9'>
            <img src='images/book_images/big/Inside Mari Manga Volume 9_lg.jpg'
              alt='Suggested Book 1' />
          </Link>
        </div>
        <div className='img-wrapper'>
          <Link to='/Black-Butler-Manga-Volume-30'>
            <img src='images/book_images/big/Black Butler Manga Volume 30_lg.jpg'
              alt='Suggested Book 1' />
          </Link>
        </div>
        <div className='img-wrapper'>
          <Link to='/Radiant-Manga-Volume-14'>
            <img src='images/book_images/big/Radiant Manga Volume 14_lg.jpg'
              alt='Suggested Book 1' />
          </Link>
        </div>
        <div className='img-wrapper'>
          <Link to='/Attack-on-Titan-Manga-Volume-34'>
            <img src='images/book_images/big/Attack on Titan Manga Volume 34_lg.jpg'
              alt='Suggested Book 1' />
          </Link>
        </div>
        <div className='img-wrapper'>
          <Link to='/Call-of-the-Night-Manga-Volume-3'>
            <img src='images/book_images/big/Call of the Night Manga Volume 3_lg.jpg'
              alt='Suggested Book 1' />
          </Link>
        </div>
      </Slider>
    </>
  )
}

const HomeSuggestedBooksMobile = () => {
  return (
    <ul className='flex suggested-books'>
      <li>
        <Link to='/Chainsaw-Man-Manga-Volume-6'>
          <img src='images/book_images/big/Chainsaw Man Manga Volume 6_lg.jpg'
            alt='Suggested Book 1' />
        </Link>
      </li>
      <li>
        <Link to='/Inside-Mari-Manga-Volume-9'>
          <img src='images/book_images/big/Inside Mari Manga Volume 9_lg.jpg'
            alt='Suggested Book 1' />
        </Link>
      </li>
      <li>
        <Link to='/Black-Butler-Manga-Volume-30'>
          <img src='images/book_images/big/Black Butler Manga Volume 30_lg.jpg'
            alt='Suggested Book 1' />
        </Link>
      </li>
      <li>
        <Link to='/Radiant-Manga-Volume-14'>
          <img src='images/book_images/big/Radiant Manga Volume 14_lg.jpg'
            alt='Suggested Book 1' />
        </Link>
      </li>
      <li>
        <Link to='/Attack-on-Titan-Manga-Volume-34'>
          <img src='images/book_images/big/Attack on Titan Manga Volume 34_lg.jpg'
            alt='Suggested Book 1' />
        </Link>
      </li>
      <li>
        <Link to='/Call-of-the-Night-Manga-Volume-3'>
          <img src='images/book_images/big/Call of the Night Manga Volume 3_lg.jpg'
            alt='Suggested Book 1' />
        </Link>
      </li>
    </ul>
  )
}

const Home: React.FC = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, [])

  const isMobile = width <= 688


  return (
    <section className='home flex'>
      <section className='book-carousel-wrapper'>
        <HomeCarousel />
      </section>
      <section className='book-samples flex'>
        <h2>Suggested Reads</h2>
        {isMobile ? <HomeSuggestedBooksMobile /> : <HomeSuggestedBooksCarousel />}
      </section>
    </section>
  )
}

export default Home