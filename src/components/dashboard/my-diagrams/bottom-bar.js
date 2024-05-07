import { Input } from "@mui/material";

function BottomBar({askClaude}) {
    return (
        <Input placeholder="Ask Claude" onKeyPress={(e) => {
            if (e.key === 'Enter') {
                askClaude(e.target.value);
                // e.target.value = '';
            }
        }
        } />
    );
}

export default BottomBar;