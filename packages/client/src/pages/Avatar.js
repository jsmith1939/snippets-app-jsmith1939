import React, {useState} from 'react';
import { RegisterPage } from './RegisterPage';
import './style.css';



export default function handleAvatar ({picker}) {
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

    return (
        <>
        {imgs.map((img) => {
            return (
                <img
                    id='avatar'
                    alt={img}
                    key={img}
                    src={img}
                    onClick={() => picker(img)}
                />
            )
        })}
        </>
    )
}