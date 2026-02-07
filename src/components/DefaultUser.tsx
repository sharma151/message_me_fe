import { IoPerson } from 'react-icons/io5'

const DefaultUser = ({
  size = 48, // circle size (px)
  bgColor = '#242626', // background color
  iconColor = '#bfbfbf', // icon color
  iconSize = 24, // icon size (px)
  Icon = IoPerson, // allow custom icon
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border:'1px solid #2E2F2F'
      }}
    >
      <Icon size={iconSize} color={iconColor} />
    </div>
  )
}

export default DefaultUser
