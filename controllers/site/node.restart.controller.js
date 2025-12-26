const nodeRestart = (req, res) => {
    if (req.headers.authorization !== `Bearer ${process.env.RESTART_SECRET}`) {
        return res.sendStatus(403);
      }
    
      res.send("Restarting");
      process.exit(0);
    };

export default nodeRestart;