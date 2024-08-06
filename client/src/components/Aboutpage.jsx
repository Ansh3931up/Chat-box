import aboutimg from "../assets/aboutimg.jpg";
import { Carouseldata } from "../assets/Carouseldata";
import Carousel from "./Carousel";

function AboutPage() {
  return (
    <div className="flex flex-col gap-10 bg-orange-100 text-black px-4 py-10 md:px-8 md:py-16 lg:px-20 lg:py-20">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <section className="lg:w-1/2 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-500">
            About Rashtriya Swayamsevak Sangh (RSS)
          </h1>
          <p className="text-base md:text-lg">
            Welcome to the official page of Rashtriya Swayamsevak Sangh (RSS). Established with a profound vision to foster a united and resilient society, RSS has been a stalwart in promoting cultural nationalism, social harmony, and selfless service for decades. Rooted in the principles of Hindutva and dedicated to the welfare of the nation, RSS is committed to nurturing individuals to become disciplined, responsible citizens who contribute positively to the fabric of our diverse nation. Explore our journey, initiatives, and the values that drive us as we continue to strive for a prosperous and inclusive India.
          </p>
        </section>
        <div className="lg:w-1/2 flex justify-center">
          <img
            src={aboutimg}
            alt="About RSS"
            className="w-full max-w-md drop-shadow-2xl rounded-md"
            style={{ filter: "drop-shadow(0px 10px 10px rgb(255, 104, 31))" }}
          />
        </div>
      </div>
      <div className="w-full">
        {Carouseldata && Carouseldata.map((data) => (
          <Carousel
            description={data.description}
            title={data.title}
            image={data.image}
            slide={data.slide}
            totalslide={Carouseldata.length}
            key={data.slide}
          />
        ))}
      </div>
    </div>
  );
}

export default AboutPage;
