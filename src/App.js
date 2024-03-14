
import { useEffect, useState } from 'react';

function App() {

  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  const [distanceCompare, setDistanceCompare] = useState([]);

  const [points, setPoints] = useState([{x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}]);

  // 測試誤差
  const [distanceCompareRecord1, setDistanceCompareRecord1] = useState([]);
  const [distanceCompareRecord2, setDistanceCompareRecord2] = useState([]);
  const [distanceCompareRecord3, setDistanceCompareRecord3] = useState([]);
  const [compareRecordRange1, setCompareRecordRange1] = useState([]);
  const [compareRecordRange2, setCompareRecordRange2] = useState([]);
  const [compareRecordRange3, setCompareRecordRange3] = useState([]);

  const col = () => {
    const colRange = (arr) => {
      const range = [
        [arr[0][0], arr[0][0]],
        [arr[0][1], arr[0][1]],
        [arr[0][2], arr[0][2]],
        [arr[0][3], arr[0][3]],
        [arr[0][4], arr[0][4]],
        [arr[0][5], arr[0][5]],
        [arr[0][6], arr[0][6]],
        [arr[0][7], arr[0][7]],
        [arr[0][8], arr[0][8]],
      ]
      arr.map(item => {
        for(let i=0; i<9; i++) {
          if (item[i] < range[i][0]) {
            range[i][0] = item[i]
          } else if (item[i] > range[i][1]) {
            range[i][1] = item[i]
          }
        }
      })
      return range
    }

    if (distanceCompareRecord1.length > 0) setCompareRecordRange1(colRange(distanceCompareRecord1))
    if (distanceCompareRecord2.length > 0) setCompareRecordRange2(colRange(distanceCompareRecord2))
    if (distanceCompareRecord3.length > 0) setCompareRecordRange3(colRange(distanceCompareRecord3))
  }
  
  useEffect(() => {

    // Event Listener - get screen size
    // const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    // };
    // handleResize();

    const handleTouchStart = (event) => {
      if (event.touches.length === 5) {

        const p1 = {x: parseInt(event.touches[0].clientX), y: parseInt(event.touches[0].clientY)};
        const p2 = {x: parseInt(event.touches[1].clientX), y: parseInt(event.touches[1].clientY)};
        const p3 = {x: parseInt(event.touches[2].clientX), y: parseInt(event.touches[2].clientY)};
        const p4 = {x: parseInt(event.touches[3].clientX), y: parseInt(event.touches[3].clientY)};
        const p5 = {x: parseInt(event.touches[4].clientX), y: parseInt(event.touches[4].clientY)};
        setPoints([p1,p2,p3,p4,p5].sort((a, b) => a.x - b.x))

        // 計算比較參數
        const d = (point1, point2) => Math.hypot(point1.x - point2.x, point1.y - point2.y);  // 2點距離

        const pointGroup = [p1, p2, p3, p4, p5];
        const centerPoint = {
          x: pointGroup.reduce((acc, curr) => acc + curr.x, 0) / 5,
          y: pointGroup.reduce((acc, curr) => acc + curr.y, 0) / 5,
        };

        const newSort = pointGroup.sort((a, b) => d(centerPoint, a) - d(centerPoint, b));

        const c = [];
        for(let i=0; i<=3; i++) {
          for(let j=i+1; j<=4; j++) {
            c.push(Math.round(d(newSort[i], newSort[j])));
          }
        }
        const standard = c[0];
        c.shift();

        setDistanceCompare(c.map(para => (para/standard).toFixed(2)));
      }
    }

    // window.addEventListener('resize', handleResize);
    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      // window.removeEventListener('resize', handleResize);
      window.removeEventListener('touchstart', handleTouchStart);
    }
  }, [])

  useEffect(() => {
    // 比較兩組參數是否完全不一樣
    const diff = (arrA, arrB) => {
      for (let i = 0; i < arrA.length; i++) {
        if (Math.abs(arrA[i] - arrB[i]) / arrA[i] > 0.2) return true;
      }
      return false;
    }

    // 記錄比較參數record
    // 由於蓋印有座標誤差，導致判斷點的順序不一，所以可能有2組或以上的比較參數
    if (distanceCompare.length > 0) {
      if (distanceCompareRecord1.length === 0 || !diff(distanceCompareRecord1[distanceCompareRecord1.length-1], distanceCompare)) {
        setDistanceCompareRecord1([...distanceCompareRecord1, distanceCompare]);
      } else if (distanceCompareRecord2.length === 0 || !diff(distanceCompareRecord2[distanceCompareRecord2.length-1], distanceCompare)) {
        setDistanceCompareRecord2([...distanceCompareRecord2, distanceCompare]);
      } else {
        setDistanceCompareRecord3([...distanceCompareRecord3, distanceCompare]);
      }
      
    }
  }, [distanceCompare])

  const styles = {
    body: {
      width: screenWidth,
      height: screenHeight,
      backgroundColor: 'black',
      position: 'relative', 
    },
    title: {
      position: 'absolute', 
      width: screenWidth,
      color: 'white',
      textAlign: 'center',
    },
    pointImg: {
      position: 'absolute', 
      width: 10,
      height: 10,
    },
    stampInfoBox: {
      color: 'white',
      width: screenWidth * 0.8,
      marginTop: screenHeight * 0.5,
      marginLeft: screenWidth * 0.1,
      // border: '0.1px solid white',
    },
  };

  return (
    <div style={styles.body}>-
      <div style={styles.title}>五點印章</div>
      {points.map((p, index) => (
        <img key={index} src="/point.png" style={{...styles.pointImg, top: p.y-5, left:p.x-5}}/>
      ))}
      <div style={styles.stampInfoBox}>

        {/* {points.map((p, index) => (
          <div key={index} style={{marginBottom: 5}}>{`point ${index+1} : (${p.x > 0 ? p.x : ''}, ${p.y > 0 ? p.y : ''})`}</div>
        ))} */}
        <div style={{marginBottom: 5}}>
          <div>Points：</div>
          <div>{points.map(p=>`(${p.x}, ${p.y}), `)}</div>
        </div>

        <div style={{marginBottom: 8}}>
          <div>比較參數：</div>
          <div>{distanceCompare.map(d=>`${d}, `)}</div>
        </div>

        <button onClick={col}>{`計算誤差量 (${distanceCompareRecord1.length}/${distanceCompareRecord2.length}/${distanceCompareRecord3.length})`}</button>


        {/* {distanceCompareRecord1.map((d, index) => (
          <div key={index} style={{marginBottom: 5}}>{JSON.stringify(d)}</div>
        ))} */}

        <div>{compareRecordRange1.map(r => `(${r[0]}-${r[1]}),  `)}</div>
        <div>{compareRecordRange2.map(r => `(${r[0]}-${r[1]}),  `)}</div>
        <div>{compareRecordRange3.map(r => `(${r[0]}-${r[1]}),  `)}</div>
      </div>
    </div>
  );
}

export default App;
