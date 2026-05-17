"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PostListingForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function uploadFile(file: File, folder: string) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
    const fileName = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    let imageUrl = "";
    const documentUrls: string[] = [];

    const imageFile = formData.get("image") as File;
    const documentFiles = formData
      .getAll("documents")
      .filter((file): file is File => file instanceof File && file.size > 0);

    try {
      if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadFile(imageFile, "listing-images");
      }

      for (const documentFile of documentFiles) {
        documentUrls.push(await uploadFile(documentFile, "listing-documents"));
      }

      const payload: Record<string, string | number | string[]> = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        listing_type: formData.get("listing_type") as string,
        property_type: formData.get("property_type") as string,
        city: formData.get("city") as string,
        neighborhood: formData.get("neighborhood") as string,
        price: Number(formData.get("price")),
        image_url: imageUrl,
        status: "pending",
        verification_status:
          documentUrls.length > 0 ? "documents submitted" : "unverified",
        risk_score: "medium",
      };

      if (documentUrls.length > 0) {
        payload.document_urls = documentUrls;
      }

      const { error } = await supabase.from("listings").insert(payload);

      if (error) {
        throw error;
      }

      form.reset();
      setMessage(
        "Listing submitted successfully. It will be reviewed before going live."
      );
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

      <select name="listing_type" className="w-full rounded-xl border p-3">
        <option value="rent">Rent</option>
        <option value="sale">Sale</option>
      </select>

      <select name="property_type" className="w-full rounded-xl border p-3">
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
        <label className="mb-2 block font-semibold">Property Image</label>

        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div className="rounded-2xl border border-dashed border-[#0B5D3B]/40 bg-[#FAF8F2] p-4">
        <label className="mb-2 block font-semibold">
          Verification Documents
        </label>

        <p className="mb-3 text-sm text-gray-700">
          Add title deed, ID, lease, ownership proof, or other review documents.
          On a phone, this can open the camera so the seller can take a picture
          in real time.
        </p>

        <input
          name="documents"
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="w-full rounded-xl border bg-white p-3"
        />
      </div>

      <button
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[#0B5D3B] p-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit Listing for Review"}
      </button>
    </form>
  );
}
