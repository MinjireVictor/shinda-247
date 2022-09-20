import React from "react"
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from "../../../../assets/jp1.jpeg"
import Image2 from "../../../../assets/jp2.jpeg"

const CarouselComponent=()=>{
    return (
        <Carousel showArrows={true} showStatus={false} 
        showIndicators={false} showThumbs={false} autoPlay={true} 
        infiniteLoop={true} interval={5000}>
            <div>
            <img src={Image} alt=""></img>
            </div>
            <div>
            <img src={Image2} alt=""></img>
            </div>
           
        </Carousel>
    );

}
export default CarouselComponent