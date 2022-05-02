import React from 'react'

const AssetsTitle = ({ children }) => {
  return (
    <div
      style={{
        width: 680,
        backgroundColor: 'rgba(246, 246, 246, 0.8)',
        marginTop: 16,
        marginLeft: 125,
        marginBottom: 13,
        paddingLeft: 12,
        color: 'rgba(0, 0, 0, 0.65)'
      }}
    >
      {children}
    </div>
  )
}

export default AssetsTitle
