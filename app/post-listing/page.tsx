import PostListingForm from "./PostListingForm";

export default function PostListingPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F2] px-6 py-10 text-[#1F2933]">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-2 text-3xl font-bold">Post a Property Listing</h1>
        <p className="mb-8 text-gray-700">
          Submit your property for review. Verified listings get more trust from buyers and renters.
        </p>

        <PostListingForm />
      </div>
    </main>
  );
}