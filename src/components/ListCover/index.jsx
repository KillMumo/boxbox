import React from 'react'
// import cover from '../../assets/cover.jpeg'

const style = {
  display: 'inline-block',
  height: 44,
  width: 66,
  background: ''
}

const ListCover = (props) => {
  const { url, name } = props

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* <img style={style} src={url || cover} alt="" /> */}
      <img style={style} src={url} alt="" />
      <span
        style={{
          marginLeft: 16,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 220
        }}
        title={name}
      >
        {name}
      </span>
    </div>
  )
}

export default ListCover
