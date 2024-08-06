import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";

import updateImage from "./update.jpg";

function formatDate(createdAt) {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function BlogDescriptionPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { thumbnail, title, description, createdAt } = state;

  const formattedDate = formatDate(createdAt);

  return (
    <div
      className="w-full min-h-screen flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url(${updateImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Typography variant="h2" color="white" className="mb-8 text-center">
        Latest Update
      </Typography>
      <Card className="w-full md:w-11/12 lg:w-9/12 xl:w-8/12 shadow-lg bg-white mx-auto">
        <CardHeader className="w-full h-48 md:h-60 lg:h-72">
          <img
            src={thumbnail}
            alt="thumbnail"
            className="w-full h-full object-cover"
            style={{ maxHeight: '300px' }} // Adjust the max height here
          />
        </CardHeader>
        <CardBody className="w-full h-full flex flex-col justify-between p-4">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-medium mb-4 text-center">
              {title}
            </Typography>
            <div className="mb-4 text-sm h-96 overflow-y-auto" dangerouslySetInnerHTML={{ __html: description }} />
            <Typography color="gray" className="mb-4 text-center">
              Published on: {formattedDate}
            </Typography>
          </div>
          <CardFooter className="pt-3">
            <Button size="lg" fullWidth={true}>
              Reserve
            </Button>
          </CardFooter>
        </CardBody>
      </Card>
      <button
        type="button"
        className="text-white bg-orange-500 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2 mt-8"
        onClick={() => navigate('/updates')}
      >
        GET BACK
      </button>
    </div>
  );
}

export default BlogDescriptionPage;
