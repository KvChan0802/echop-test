
import { useEffect, useState } from 'react';

function App() {

  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  const [distanceCompare, setDistanceCompare] = useState([]);

  const [points, setPoints] = useState([{x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}]);

  // 測試誤差
  const [distanceCompareRecord1, setDistanceCompareRecord1] = useState([])
  const [distanceCompareRecord2, setDistanceCompareRecord2] = useState([])
  const [distanceCompareRecord3, setDistanceCompareRecord3] = useState([])

  useEffect(() => {

    // Event Listener - get screen size
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };
    handleResize();

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
        c.push(Math.round(d(newSort[0], newSort[1])));
        c.push(Math.round(d(newSort[0], newSort[2])));
        c.push(Math.round(d(newSort[0], newSort[3])));
        c.push(Math.round(d(newSort[0], newSort[4])));
        c.push(Math.round(d(newSort[1], newSort[2])));
        c.push(Math.round(d(newSort[1], newSort[3])));
        c.push(Math.round(d(newSort[1], newSort[4])));
        c.push(Math.round(d(newSort[2], newSort[3])));
        c.push(Math.round(d(newSort[2], newSort[4])));
        c.push(Math.round(d(newSort[3], newSort[4])));
        const standard = c[0];
        c.shift();

        setDistanceCompare(c.map(para => (para/standard).toFixed(2)));
      }
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('touchstart', handleTouchStart);
    }
  }, [])

  useEffect(() => {
    // 比較兩組參數是否完全不一樣
    const diff = (arrA, arrB) => {
      for (let i = 0; i < arrA.length; i++) {
        // console.log(Math.abs(arrA[i] - arrB[i]))
        // console.log(Math.abs(arrA[i] - arrB[i]) / arrA[i]);
        if (Math.abs(arrA[i] - arrB[i]) / arrA[i] > 0.2) return true;
      }
      return false;
    }

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
      width: screenWidth * 0.6,
      marginTop: screenHeight * 0.5,
      marginLeft: screenWidth * 0.2,
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

        <button>{`計算誤差 (${distanceCompareRecord1.length}/${distanceCompareRecord2.length}/${distanceCompareRecord3.length})`}</button>
      </div>
    </div>
  );
}

export default App;
