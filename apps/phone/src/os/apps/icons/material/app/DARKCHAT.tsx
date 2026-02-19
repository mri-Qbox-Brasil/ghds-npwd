import ForumIcon from '@mui/icons-material/Forum';
import { Box, styled } from '@mui/material';
import img from '../../../../../../src/apps/imgs/garlic.jpg';


const DarkchatIconStyle = styled(Box)`
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.00) 0px 1px 3px 0px, rgba(27, 31, 35, 0.00) 0px 0px 0px 2px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  img {
    border-radius: 12px;
  }

  &:hover {
    z-index: 20;
    transform: scale(1.05);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 12px;
  }
`;
const DarkchatIcon = () => 

  <DarkchatIconStyle>
    <img src={img} width={100} alt="" />
  </DarkchatIconStyle>
;

export default DarkchatIcon;
