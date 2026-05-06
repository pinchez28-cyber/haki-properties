"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PostListingForm() {
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    let imageUrl = "";

    const imageFile = formData.get("image") as File;

    if (imageFile && imageFile.size > 0) {
      const fileName = `${Date.now()}-${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error(uploadError);
        setMessage("Image upload failed. Please try again.");
        return;
      }

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const payload = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      listing_type: formData.get("listing_type") as string,
      property_type: formData.get("property_type") as string,
      city: formData.get("city") as string,
      neighborhood: formData.get("neighborhood") as string,
      price: Number(formData.get("price")),
      image_url: imageUrl,
      status: "pending",
      verification_status: "unverified",
      risk_score: "medium",
    };

    const { error } = await supabase.from("listings").insert(payload);

    if (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
      return;
    }

    form.reset();

    setMessage(
      "Listing submitted successfully. It will be reviewed before going live."
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message && (
        <p className="rounded-xl bg-green-100 p-3 font-semibold text-green-700">
          {message}
        </p>
      )}

      <input
        name="title"
        className="w-full rounded-xl border p-3"
        placeholder="Listing title"
        required
      />

      <select
        name="listing_type"
        className="w-full rounded-xl border p-3"
      >
        <option value="rent">Rent</option>
        <option value="sale">Sale</option>
      </select>

      <select
        name="property_type"
        className="w-full rounded-xl border p-3"
      >
        <option value="apartment">Apartment</option>
        <option value="house">House</option>
        <option value="land">Land</option>
        <option value="commercial">Commercial</option>
      </select>

      <input
        name="city"
        className="w-full rounded-xl border p-3"
        placeholder="City"
        required
      />

      <input
        name="neighborhood"
        className="w-full rounded-xl border p-3"
        placeholder="Neighborhood"
      />

      <input
        name="price"
        type="number"
        className="w-full rounded-xl border p-3"
        placeholder="Price"
        required
      />

      <textarea
        name="description"
        className="min-h-32 w-full rounded-xl border p-3"
        placeholder="Description"
      />

      <div>
        <label className="mb-2 block font-semibold">
          Property Image
        </label>

        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full rounded-xl border p-3"
        />
      </div>

      <button className="w-full rounded-xl bg-[#0B5D3B] p-4 font-semibold text-white">
        Submit Listing for Review
      </button>
    </form>
  );
}