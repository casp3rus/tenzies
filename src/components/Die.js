import { nanoid } from 'nanoid';

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? '#59E391' : '#ffffff',
  }

  const dieFace = []

  for (let i = 1; i <= props.value; i++) {
    dieFace.push(<span key={nanoid()} className='pip'></span>)
  }

  return (
    <div
      className='face'
      style={styles}
      onClick={props.holdDie}
    >
      {dieFace}
    </div>
  );
}