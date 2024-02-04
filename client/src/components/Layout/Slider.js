import React, { useState, useEffect } from 'react';
 
import "./style/slider.css"
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const Slider = ({ slides }) => {      
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const nextSlide = () => {
    setCurrent((prevCurrent) => (prevCurrent === length - 1 ? 0 : prevCurrent + 1));
  };

  const prevSlide = () => {
    setCurrent((prevCurrent) => (prevCurrent === 0 ? length - 1 : prevCurrent - 1));
  };

  

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }


  return (
    <section className='slider mt-4 mb-4'>
      
      {slides.map((slide, index) => {
        return (
          <div
            className={index === current ? 'slide active' : 'slide'}
            key={index} 
          >
            {index === current && (
              <div className='container d-flex align-items-center'>
                <div className='row'>
                  <div className='col-md-6'>
                    <img
                      src={slide.img}
                      alt='travel image'
                      className='image'
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </div>
                  <div className='col-md-5'>
                    <div className='slide-content'>
                      <h2 style={{color: "#125E8A", marginTop: "12px",padding: "10px" }}>{slide.title}</h2>
                      <h5 style={{padding: "10px"}}>{slide.desc}</h5>
                    </div>
                  </div>
                </div>
                <KeyboardArrowLeftOutlinedIcon className='left-arrow' onClick={prevSlide} />
              <KeyboardArrowRightOutlinedIcon  className='right-arrow' onClick={nextSlide} />
              </div>
              
            )}
          </div>
        );
      })}
      
    </section>
  );
};
 
   
export default Slider;