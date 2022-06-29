import React from "react";
import './ImageLinkForm.css'

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) =>{
     return(
        <div>
            <p className="f3">
                {'THis will detect face in pictures'}
            </p>
            <div className="form center">
                <div className="center pa4 br3 shadow-5 form">
                    <input className="f4 pa2 w-70 center" type="tex" onChange={onInputChange}/>
                    <button 
                    className="w-30 grow f4 link pv2 dib white bg-light-purple"
                    onClick={onButtonSubmit}
                    >Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;