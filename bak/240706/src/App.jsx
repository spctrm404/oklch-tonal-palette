import { useRef, useState } from 'react';
import Gamut from './components/Gamut/Gamut.jsx';
import Palette from './components/Palette/Palette.jsx';
import './App.scss';

function App() {
  const [palettes, setPalettes] = useState([
    {
      idx: 0,
      chipNum: 10,
      lInflection: 0.5,
      cMax: 0.11,
      hueFrom: 0,
      hueTo: 200,
    },
  ]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const gamutContainerRef = useRef();

  const createNewPalette = () => {
    const palettesCoppied = palettes.map((aPalette) => ({
      ...aPalette,
    }));

    const newIdx = palettesCoppied.length;
    const randomChroma = Math.random() * 0.4;
    const randomHueFrom = Math.random() * 360;
    const randomHueTo = Math.random() * 360;
    const newPalette = {
      idx: palettesCoppied.length,
      chipNum: 20,
      lInflection: 0.5,
      cMax: randomChroma,
      hueFrom: randomHueFrom,
      hueTo: randomHueTo,
    };

    palettesCoppied.push(newPalette);
    setPalettes(palettesCoppied);
    setCurrentIdx(newIdx);
  };

  return (
    <>
      <div className="layout">
        <div className="section section__control">
          <div className="gamut-container" ref={gamutContainerRef}>
            <Gamut
              gamutContainerRef={gamutContainerRef}
              chipNum={palettes[currentIdx].chipNum}
              lInflection={palettes[currentIdx].lInflection}
              cMax={palettes[currentIdx].cMax}
              hueFrom={palettes[currentIdx].hueFrom}
              hueTo={palettes[currentIdx].hueTo}
            ></Gamut>
          </div>
        </div>
        <div className="section section__palette">
          <div className="add-palette" onPointerDown={createNewPalette}>
            <div className="add-palette__label">+</div>
          </div>
          <div className="palettes">
            {palettes
              .slice(0)
              .reverse()
              .map((aPalette) => {
                return (
                  <Palette
                    key={crypto.randomUUID()}
                    idx={aPalette.idx}
                    chipNum={aPalette.chipNum}
                    lInflection={aPalette.lInflection}
                    cMax={aPalette.cMax}
                    hueFrom={aPalette.hueFrom}
                    hueTo={aPalette.hueTo}
                    callback={setCurrentIdx}
                  ></Palette>
                );
              })}
          </div>
        </div>
        <div className="content">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt
          officiis dolore porro expedita? Dolor libero soluta eum obcaecati
          laboriosam quae voluptatum maiores veniam consequatur perspiciatis
          veritatis sequi optio inventore vitae eaque natus itaque architecto
          in, quo, accusamus consectetur praesentium doloribus ex cum. Culpa,
          rerum dolore aspernatur eveniet deserunt qui cum obcaecati! Fuga,
          exercitationem dolorum. Possimus vero, ipsum fuga cum officiis
          mollitia, est aliquam maiores tempore blanditiis deserunt numquam
          repellendus. Eius dicta, saepe nesciunt corporis hic nobis vitae magni
          eveniet repellendus necessitatibus asperiores consequuntur nemo quo
          itaque error quam! Aliquid sint iusto, sequi facere nobis maiores
          earum et! Aliquid incidunt libero ut fuga sunt! Beatae quo earum esse
          dolor fugit eveniet mollitia voluptates eligendi animi incidunt?
          Aliquam molestias voluptates magni optio voluptas accusantium commodi
          quae saepe itaque consectetur. Voluptatibus cupiditate qui ipsum
          dignissimos mollitia sequi rerum inventore, molestiae et reiciendis
          corporis ea sint numquam, iste, eaque vitae animi tempora nulla
          corrupti officia dolorum. Velit quo iure, blanditiis sit eligendi
          dolore recusandae quidem cum, nisi accusantium est excepturi, natus
          porro in facilis magnam hic assumenda magni aut non fuga? Quod
          voluptas obcaecati maxime ducimus eaque magni molestias ipsum
          veritatis saepe distinctio accusamus autem illum nisi quidem, dolorem
          consequatur eligendi natus ex deserunt. Animi eum amet illum error
          placeat quaerat corporis dicta, in possimus dignissimos sunt laborum
          consequuntur expedita minima, quo, ducimus consectetur odio ratione
          eligendi quisquam? Maxime ipsam recusandae rerum officiis
          voluptatibus? Odio, earum fugiat. Magnam, expedita reiciendis odio
          ipsum sed, quibusdam blanditiis temporibus dolor delectus libero,
          illum voluptatibus. Animi soluta tempora deserunt alias culpa
          quisquam, eum suscipit fugiat sit quas assumenda ducimus, rerum odio
          beatae. Dolorum itaque eaque, velit vitae nam nulla omnis laboriosam
          fuga doloribus recusandae accusamus illo nesciunt eius earum fugit
          accusantium, architecto ea tempore! Ipsam, porro libero magnam quam
          alias harum! Deserunt dignissimos quasi adipisci quae quo id, ullam
          commodi dolorum dicta, fugiat eius alias laudantium vel nisi. Odio
          temporibus ea quaerat obcaecati unde veniam inventore non culpa autem.
          Ducimus nemo obcaecati consectetur atque modi sequi numquam ab alias,
          tempore totam placeat, et molestias ipsum eos eligendi aliquam quaerat
          sit facere eius sapiente architecto laudantium. Aliquam odio animi
          dolorem, fuga sit id voluptatibus error ad et dolor, qui debitis.
          Labore libero amet voluptatum natus adipisci non velit at ad, vel ab
          quis possimus fugit assumenda accusantium eum molestiae asperiores
          maxime odit impedit repudiandae. Porro odio nam, vel ratione a earum
          dolores corporis perferendis quis eum necessitatibus eos. Obcaecati
          odit, magnam laboriosam aspernatur, deserunt modi iure quod
          dignissimos nemo ad assumenda quo, quas provident suscipit nobis esse
          facilis doloribus. Velit, perferendis cupiditate eveniet nostrum
          necessitatibus quas ipsum pariatur doloribus cumque aliquam saepe
          officiis dolores? Modi in delectus voluptatem error quis similique,
          dicta et ipsa eum reprehenderit amet voluptate libero tempore
          aspernatur, quam ipsum alias ab. Fuga numquam ad, odio inventore porro
          ipsa iste eum voluptatem quas doloribus, ducimus ea unde, ipsam
          voluptates ratione hic. Perferendis, accusantium. Ex earum in sunt
          quisquam sit optio, aspernatur minima itaque aut debitis tenetur sint
          eaque odit maiores exercitationem nihil, quaerat rerum? Ut,
          asperiores.
        </div>
      </div>
    </>
  );
}

export default App;
