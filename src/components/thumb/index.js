import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'

import './style.css'

const Model = ({temp}) => {
    const obj = useLoader(OBJLoader, '/thumb_centered.obj')
    const rot = ( -0.015 * temp ) + 4.5;
    return <primitive object={obj} position={[-0.3, 0, 2]} rotation={[rot, 0, 0]}>
        <meshToonMaterial/>
    </primitive>
}

const interpolateColor = (c0, c1, f) => {
    c0 = c0.match(/.{1,2}/g).map((oct)=>parseInt(oct, 16) * (1-f))
    c1 = c1.match(/.{1,2}/g).map((oct)=>parseInt(oct, 16) * f)
    let ci = [0,1,2].map(i => Math.min(Math.round(c0[i]+c1[i]), 255))
    return ci.reduce((a,v) => ((a << 8) + v), 0).toString(16).padStart(6, "0")
}

const Thumb = ({temp}) => {

    const getBGColor = (temp) => {
        const ratio = ( 0.005 * temp ) + 0.5
        console.log('ratio', ratio, temp)
        return `#${interpolateColor('ff0000', '0000ff', ratio)}`
    }

    return (
        <div className="container" style={{background: getBGColor(temp)}}>
            <Canvas>
                <Suspense fallback={null}>
                    <pointLight position={[10, 10, 10]}/>
                    <Model temp={temp} />
                </Suspense>
            </Canvas>
        </div>
    )
}

export default Thumb