import React, {useState} from 'react';
import './style.css';



export default function HandleAvatar ({picker, selectedImg}) {
    const [selected, setSelected] = useState(selectedImg);
    let imgs = [
        '/bird.svg',
        '/dog.svg',
        '/fox.svg',
        '/frog.svg',
        '/lion.svg',
        '/owl.svg',
        '/tiger.svg',
        '/whale.svg',
    ]

    const updateImage = (img) => {
        picker(img);
        setSelected(img);
    }

    return (
        <>
        {imgs.map((img) => {
            return (
                <img
                    className={img === selected ? 'selected' : null}
                    id='avatar'
                    alt={img}
                    key={img}
                    src={img}
                    onClick={() => updateImage(img)}
                />
            )
        })}
        </>
    )
}