import { TabMenu } from 'primereact/tabmenu';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import courseImg from '../../images/course.jpg'
import examImg from '../../images/exam.jpg'
import learnImg from '../../images/learning.jpg'
import profil from '../../images/profil.JPG';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import logoutImg from '../../images/logout.jpg';

export default function HomeTeacher(props) {   
  const logout =()=>{
    navigate('/');
    localStorage.clear();
  }


 
  // const items = [
  //   { label: 'Courses', icon: 'pi pi-bookmark', command: () => { navigate('/courses') } },
  //   { label: 'Tests', icon: 'pi pi-fw pi-pencil', command: () => { navigate('/tests') } },
  //   { label: 'Tasks', icon: 'pi pi-fw pi-file', command: () => { navigate('/tasks') } }
  // ];
const navigate = useNavigate(); 

  const images = [

    {
      url: examImg,
      title: 'Exam for checking',
      width: '33%',
      nav:'/'
    },
    {
      url: learnImg,
      title: 'My Courses',
      width: '34%',
      nav:'/courses/teachers/my-courses'
    },
    {
      url: courseImg,
      title: 'Courses',
      width: '33%',
      nav:'/courses'
    },
  ];

  const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('sm')]: {
      width: '100% !important', // Overrides inline-style
      height: 100,

    },
    '&:hover, &.Mui-focusVisible': {
      zIndex: 1,
      '& .MuiImageBackdrop-root': {
        opacity: 0.15,
      },
      '& .MuiImageMarked-root': {
        opacity: 0,
      },
      '& .MuiTypography-root': {
        border: '4px solid currentColor',
      },
    },
  }));

  const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  });

  const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  }));

  const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
  }));

  const ImageMarked = styled('span')(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  })
  );
  
  return (
    <div >
      <div style={{ display: 'flex' }}>
        {/* <TabMenu model={items} /> */}
        <Stack direction="row" spacing={2}>
          <Avatar
            alt={localStorage.getItem("name")}
            src={profil}
            sx={{ width: 56, height: 56 }}
          />
          <Avatar
            src={logoutImg}
            sx={{ width: 60, height: 60 }}
            onClick={()=>{logout()}}
          />
        </Stack></div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%' }}>
        {images.map((image) => (
          <ImageButton onClick={() => { navigate( `${image.nav}` )} }
            focusRipple
            key={image.title}
            style={{
              width: image.width,
            }}
          >
            <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                sx={{
                  position: 'relative',
                  p: 4,
                  pt: 2,
                  pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                }}
              >
                {image.title}
                <ImageMarked className="MuiImageMarked-root" />
              </Typography>
            </Image>
          </ImageButton>
        ))}
      </Box>
    </div>
  );
}