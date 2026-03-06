import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;


export function toDevServerHref(base: string, url: string){
    if(url.startsWith('/')){
      return `${base}${url.slice(1)}`
    }
}

describe("normal css file with base /", () => {
  test("ok", () => {
    expect(toDevServerHref("http://localhost:3000/", "/api/test")).toBe("http://localhost:3000/api/test")
  })
})