export const handleSignOut = () => async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(204).json({error: "no cookie jwt"}); //No content
    const accessToken = null
    res.clearCookie(
      "jwt", { httpOnly: true, sameSite: "None", secure: true  }
    );
    res.json({ accessToken, message: "Cookie cleared" });
};
