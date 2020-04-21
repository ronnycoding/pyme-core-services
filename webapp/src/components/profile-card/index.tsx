import React from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import { makeStyles, createStyles, withStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      height: 153,
      width: 268,
    },
    cardContent: {
      height: 84,
      width: 268,
    }
  }),
)

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(4.4)',
        opacity: 0,
      },
    },
  }),
)(Badge)

interface ProfileCardProps {
  image: string,
}

export default function ProfileCard(props: ProfileCardProps) {
  const classes = useStyles()
  const { image } = props
  return (
    <Grid item>
      <Card>
        <CardActionArea>
          <StyledBadge
            overlap="circle"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            variant="dot"
          >
            <CardMedia
              className={classes.card}
              component="img"
              alt="Contemplative Reptile"
              image={image}
              title="Contemplative Reptile"
            />
          </StyledBadge>
          <CardContent className={classes.cardContent}>
            <Typography variant="body2" color="textSecondary" component="p">
              Lizards are a widespread group of squamate reptiles
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}