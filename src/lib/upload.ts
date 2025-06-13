import { uploadToCloudinary } from "./cloudinary"

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const { url } = await uploadToCloudinary(file, "students")
      setFormData({ ...formData, profileImage: url })
      toast({
        title: "Image uploaded",
        description: "Profile image has been uploaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }