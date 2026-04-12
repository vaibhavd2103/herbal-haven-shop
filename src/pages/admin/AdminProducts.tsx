import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/adminApi";
import type { Product } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface ProductFormData {
  name: string;
  description: string;
  mrp: string;
  price: string;
  ingredients: string;
  benefits: string;
  howToUse: string;
  isActive: boolean;
}

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: "",
  ingredients: "",
  benefits: "",
  howToUse: "",
  isActive: true,
  mrp: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);

  // Existing Cloudinary URLs still kept by the user (edit mode only)
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  // Newly picked File objects + their local object URLs for preview
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newFilePreviews, setNewFilePreviews] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const data = await fetchAdminProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetImageState = () => {
    setExistingImageUrls([]);
    setNewFiles([]);
    setNewFilePreviews([]);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    resetImageState();
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      ingredients: product.ingredients.join(", "),
      benefits: product.benefits.join(", "),
      howToUse: product.howToUse.join(". "),
      isActive: product.isActive,
      mrp: String(product.mrp), // No MRP field in API, so just add ₹100 for demo
    });
    // Seed existing URLs; no new files yet
    setExistingImageUrls(product.imageUrls);
    setNewFiles([]);
    setNewFilePreviews([]);
    setDialogOpen(true);
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files]);
    setNewFilePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    // Reset input so the same file can be re-picked if needed
    e.target.value = "";
  };

  const removeExistingImage = (idx: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewFile = (idx: number) => {
    URL.revokeObjectURL(newFilePreviews[idx]);
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewFilePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      toast({
        title: "Missing fields",
        description: "Name and price are required.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const baseFields = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      mrp: parseFloat(form.mrp),
      currency: "INR",
      ingredients: form.ingredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      benefits: form.benefits
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      howToUse: form.howToUse
        .split(".")
        .map((s) => s.trim())
        .filter(Boolean),
      isActive: form.isActive,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, {
          ...baseFields,
          // Tell the server which existing Cloudinary URLs to keep.
          // Removed ones will be deleted from Cloudinary server-side.
          existingImageUrls,
          // New files to upload and append.
          images: newFiles,
        });
        toast({ title: "Product updated" });
      } else {
        await createProduct({
          ...baseFields,
          imageUrls: [],
          images: newFiles,
        });
        toast({ title: "Product created" });
      }
      setDialogOpen(false);
      await load();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Product deleted" });
  };

  if (loading)
    return (
      <p className="py-8 text-center text-muted-foreground">
        Loading products…
      </p>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Products
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif">
                {editingId ? "Edit Product" : "New Product"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Price (₹) *</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>MRP (₹) *</Label>
                  <Input
                    type="number"
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Label>Active</Label>
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                  />
                </div>
              </div>
              <div>
                <Label>Ingredients (comma-separated)</Label>
                <Input
                  value={form.ingredients}
                  onChange={(e) =>
                    setForm({ ...form, ingredients: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Benefits (comma-separated)</Label>
                <Input
                  value={form.benefits}
                  onChange={(e) =>
                    setForm({ ...form, benefits: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>How to Use (period-separated)</Label>
                <Textarea
                  value={form.howToUse}
                  onChange={(e) =>
                    setForm({ ...form, howToUse: e.target.value })
                  }
                  rows={2}
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label>Product Images</Label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {/* Existing Cloudinary images (edit mode) */}
                  {existingImageUrls.map((url, i) => (
                    <div
                      key={`existing-${i}`}
                      className="relative h-20 w-20 overflow-hidden rounded-lg border border-border"
                    >
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() => removeExistingImage(i)}
                        className="absolute right-0.5 top-0.5 rounded-full bg-destructive p-0.5 text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {/* Newly selected file previews */}
                  {newFilePreviews.map((url, i) => (
                    <div
                      key={`new-${i}`}
                      className="relative h-20 w-20 overflow-hidden rounded-lg border border-border"
                    >
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() => removeNewFile(i)}
                        className="absolute right-0.5 top-0.5 rounded-full bg-destructive p-0.5 text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Upload className="h-5 w-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFilesChange}
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full"
              >
                {submitting
                  ? "Saving…"
                  : editingId
                    ? "Update Product"
                    : "Create Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <Card key={product.id} className="border-border/50">
            <CardHeader className="flex flex-row items-start gap-3 pb-2">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                {product.imageUrls[0] ? (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                    No img
                  </div>
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-sm">{product.name}</CardTitle>
                <p className="text-sm font-semibold text-primary">
                  ₹{product.price}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.isActive ? "Active" : "Inactive"} •{" "}
                  {product.imageUrls.length} image(s)
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex gap-2 pt-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEdit(product)}
                className="gap-1"
              >
                <Pencil className="h-3 w-3" /> Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(product.id)}
                className="gap-1"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
