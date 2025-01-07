import CreatePost from "./create-post/page";


export default function Home() {
  return (
    // // <div className="min-h-screen bg-gray-50 py-12">
    // //   <div className="max-w-7xl mx-auto">
    // //     <div className="text-center mb-12">
    // //       <h1 className="text-5xl font-bold text-gray-900 mb-4">
    // //         Anonymous Message Board
    // //       </h1>
    // //       <p className="text-xl text-gray-600">
    // //         Create a topic and share anonymous thoughts
    // //       </p>
    // //     </div>
        
    //     <CreatePost />
    // //   </div>
    // // </div>
    <>
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto">
        <CreatePost/>
      </div>
    </div>
    </>
  );
}
