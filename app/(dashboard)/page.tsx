import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-10">
      <div>
        <Typography variant="h1">This is h1</Typography>
        <Typography variant="h2">This is h2</Typography>
        <Typography variant="h3">This is h3</Typography>
        <Typography variant="h4">This is h4</Typography>
        <Typography variant="lead">This is lead</Typography>
        <Typography variant="p">This is p</Typography>
        <Typography variant="large">This is large</Typography>
        <Typography variant="small">This is small</Typography>
        <Typography variant="muted">This is muted</Typography>
        <Typography variant="code">This is code</Typography>
        <Typography variant="quote">This is quote</Typography>
      </div>
      <div>
        <Button>Click me</Button>
      </div>
    </div>
  );
}
