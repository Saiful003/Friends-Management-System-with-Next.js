type props = {
  isDrawerOpen: boolean;
};

function SideBar({ isDrawerOpen }: props) {
  return (
    <aside
      className={`w-[240px] border absolute top-0 right-0 bottom-0 h-screen bg-white z-50 shadow-lg md:hidden  transition-transform translate-x-[240px] ${
        isDrawerOpen && "translate-x-0"
      }`}
    >
      this is sidebar
    </aside>
  );
}

export default SideBar;