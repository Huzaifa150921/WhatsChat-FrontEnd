import React from 'react'
import style from './loader.module.css'
const Loader = () => {
    return (
        <>

            <div className={style.loader_wrapper}>
                <span className={style.loader_letter}>W</span>
                <span className={style.loader_letter}>H</span>
                <span className={style.loader_letter}>A</span>
                <span className={style.loader_letter}>T</span>
                <span className={style.loader_letter}>S</span>
                <span className={style.loader_letter}>C</span>
                <span className={style.loader_letter}>H</span>
                <span className={style.loader_letter}>A</span>
                <span className={style.loader_letter}>T</span>
                <div className={style.loader} />
            </div>
        </>

    )
}

export default Loader