import cloundinary from 'cloudinary';

cloundinary.v2.config({
    cloud_name: "dlxkfnrh8",
    api_key: "896184672113266",
    api_secret: "YAspbUOwWP8JqCZMtzMp8sZp7xI",
});

export const cld = globalThis.cloundinary || cloundinary;

if (process.env.NODE_ENV !== 'production') globalThis.cloundinary = cloundinary;